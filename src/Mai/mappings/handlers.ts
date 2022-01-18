import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { MaiCamTokenData, MaiAmTokenData } from "../../../generated/schema";
import { MaiCamToken } from "../../../generated/MaiCamTokencamUSDC/MaiCamToken";
import { MaiCamWMatic } from "../../../generated/MaiCamTokencamWMATIC/MaiCamWMatic";
import { MaiCamAave } from "../../../generated/MaiCamTokencamWMATIC/MaiCamAave";
import { MaiAToken } from "../../../generated/MaiCamTokencamWMATIC/MaiAToken";
import { MaiLendingPool } from "../../../generated/MaiCamTokencamWMATIC/MaiLendingPool";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

import { MaiIncentivesController } from "../../../generated/MaiCamTokencamWMATIC/MaiIncentivesController";
import { ZERO_ADDRESS, ZERO_BI } from "../../utils/constants";

export function handleCamToken(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  camTokenAddress: Address,
  value: BigInt,
): void {
  let entity = MaiCamTokenData.load(txnHash.toHex());
  if (!entity) entity = new MaiCamTokenData(txnHash.toHex());
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  let amLiquidity = ZERO_BI;
  // get right underlying reserve contract.
  let reserveAddress = ZERO_ADDRESS;

  // lending pool is the same for camToken, camAave and camWMatic
  // the abi for the are the same, except for the
  let camContract = MaiCamToken.bind(camTokenAddress);
  let amTokenResult = camContract.try_usdc();
  if (amTokenResult.reverted) {
    log.warning("try_usdc() reverted", []);
    // try aave
    let camAaveContract = MaiCamAave.bind(camTokenAddress);
    let amWethResult = camAaveContract.try_aave();
    if (amWethResult.reverted) {
      log.warning("try_weth() reverted", []);
      // try WMatic
      let camWMaticContract = MaiCamWMatic.bind(camTokenAddress);
      let amWMaticResult = camWMaticContract.try_wMatic();
      if (amWMaticResult.reverted) {
        log.warning("try_wmatic() reverted", []);
      } else {
        reserveAddress = amWMaticResult.value;
      }
    } else {
      reserveAddress = amWethResult.value;
    }
  } else {
    reserveAddress = amTokenResult.value;
  }

  let symbolResult = camContract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    entity.symbol = symbolResult.value;
  }

  let decimalsResult = camContract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("try_decimals() reverted", []);
  } else {
    entity.decimals = decimalsResult.value;
  }

  // get emissions per second through the amToken incentives controller
  let amContractResult = camContract.try_Token();
  if (amContractResult.reverted) {
    log.error("try_Token() reverted", []);
  } else {
    let amContract = amContractResult.value;
    let amATokenContract = MaiAToken.bind(amContract);
    let amTokenId = amContract.toHexString();

    let amToken = MaiAmTokenData.load(amTokenId);
    if (!amToken) {
      amToken = new MaiAmTokenData(amTokenId);
      amToken.symbol = entity.symbol;
      amToken.totalLiquidity = BigInt.fromI32(0);
      amToken.decimals = 0;
    }

    let aTokenScaledTotalSupplyResult = amATokenContract.try_scaledTotalSupply();

    let aTokenDecimalsResult = amATokenContract.try_decimals();

    if (aTokenScaledTotalSupplyResult.reverted) {
      log.warning("total_supply() reverted", []);
    } else {
      if (aTokenDecimalsResult.reverted) {
        log.warning("aToken.try_decimals() reverted", []);
      } else {
        amLiquidity = aTokenScaledTotalSupplyResult.value;
        amToken.decimals = aTokenDecimalsResult.value;
      }
    }

    let incentivesControllerResult = camContract.try_AaveContract();
    if (incentivesControllerResult.reverted) {
      log.error("tokenContract at {} call getAaveContract() reverted", [camContract._address.toHex()]);
    } else {
      let incentivesControllerAddress = incentivesControllerResult.value;
      let incentivesControllerContract = MaiIncentivesController.bind(incentivesControllerAddress);
      let assetsResult = incentivesControllerContract.try_assets(amContract);

      if (assetsResult.reverted) {
        log.error("AaveincentivesControler at {} call assets({}) reverted", [
          incentivesControllerContract._address.toHex(),
          camContract._address.toHex(),
        ]);
      } else {
        let assets = assetsResult.value;
        entity.aEmissionPerSecond = assets.value0; //emissionPerSecond
      }
    }

    //amToken.totalLiquidity = amToken.totalLiquidity.plus(value);
    amToken.totalLiquidity = amLiquidity;
    amToken.save();
    entity.aTvl = convertBINumToDesiredDecimals(amToken.totalLiquidity, entity.decimals);
    // get camToken info through it's lending controller
    let lendingControllerResult = camContract.try_LENDING_POOL();
    if (lendingControllerResult.reverted) {
      log.error("try_LENDING_POOL() reverted", []);
    } else {
      let lendingControllerAddress = lendingControllerResult.value;
      let lendingPoolContract = MaiLendingPool.bind(lendingControllerAddress);
      let camTokenReserveDataResult = lendingPoolContract.try_getReserveData(reserveAddress);
      if (camTokenReserveDataResult.reverted) {
        log.error("try_getReserveData() reverted", []);
      } else {
        let camTokenConfiguration = camTokenReserveDataResult.value;
        let aTokenAddress = camTokenConfiguration.aTokenAddress;

        let liquidityRate = camTokenConfiguration.currentLiquidityRate;
        let stableBorrowRate = camTokenConfiguration.currentStableBorrowRate;
        let variableBorrowRate = camTokenConfiguration.currentVariableBorrowRate;
        let liquidityIndex = camTokenConfiguration.liquidityIndex;
        let variableBorrowIndex = camTokenConfiguration.variableBorrowIndex;
        entity.aTokenAddress = aTokenAddress;
        entity.liquidityRate = convertBINumToDesiredDecimals(liquidityRate, entity.decimals);
        entity.stableBorrowRate = convertBINumToDesiredDecimals(stableBorrowRate, entity.decimals);
        entity.variableBorrowRate = convertBINumToDesiredDecimals(variableBorrowRate, entity.decimals);
        entity.liquidityIndex = convertBINumToDesiredDecimals(liquidityIndex, entity.decimals);
        entity.variableBorrowRate = convertBINumToDesiredDecimals(variableBorrowIndex, entity.decimals);
      }
    }
  }
  let totalSupplyResult = camContract.try_totalSupply();
  if (totalSupplyResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    entity.totalLiquidity = totalSupplyResult.value;
  }
  entity.save();
}
