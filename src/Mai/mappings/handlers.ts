import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { MaiCamTokenData, MaiAmTokenData } from "../../../generated/schema";
import { MaiCamToken } from "../../../generated/MaiCamTokencamUSDC/MaiCamToken";
import { MaiAToken } from "../../../generated/MaiCamAavecamAAVE/MaiAToken";
import { MaiLendingPool } from "../../../generated/MaiCamAavecamAAVE/MaiLendingPool";
import { convertBINumToDesiredDecimals, toAddress } from "../../utils/converters";

import { MaiIncentivesController } from "../../../generated/MaiCamWMaticcamWMATIC/MaiIncentivesController";
import { ZERO_BI } from "../../utils/constants";
// TODO: Mapping for the reserve address
// get balance of the amToken so I don't use a state entity
let CAM_INCENTIVES_CONTROLLER_ADDRESS: Address = toAddress("0x357D51124f59836DeD84c8a1730D72B749d8BC23");
let CAM_LENDING_POOL_ADDRESS: Address = toAddress("0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf");

export function handleCamToken(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  camTokenAddress: Address,
  value: BigInt,
  camType: string,
  reserveAddress: Address,
): void {
  let entity = MaiCamTokenData.load(txnHash.toHex());
  if (!entity) entity = new MaiCamTokenData(txnHash.toHex());
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  let balanceOfCam = ZERO_BI;

  // lending pool is the same for camToken, camAave and camWMatic
  let camContract = MaiCamToken.bind(camTokenAddress);

  // updating entity symbol
  let symbolResult = camContract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    entity.symbol = symbolResult.value;
  }
  // updating entity decimals
  let decimalsResult = camContract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("try_decimals() reverted", []);
  } else {
    entity.decimals = decimalsResult.value;
  }
  // finding amToken info and updating amToken
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
    amToken.blockNumber = blockNumber;
    amToken.blockTimestamp = timestamp;

    let amBalanceResult = amATokenContract.try_balanceOf(camTokenAddress);
    if (amBalanceResult.reverted) {
    } else {
      balanceOfCam = amBalanceResult.value;
    }

    let aTokenDecimalsResult = amATokenContract.try_decimals();
    if (aTokenDecimalsResult.reverted) {
      log.warning("aToken.try_decimals() reverted", []);
    } else {
      amToken.decimals = aTokenDecimalsResult.value;
    }
    amToken.totalLiquidity = amToken.totalLiquidity.plus(value);
    amToken.save();

    // get emissions per second through the amToken incentives controller
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
        // https://docs.aave.com/developers/guides/apy-and-apr
        //
        entity.aEmissionPerSecond = assets.value0; //emissionPerSecond, expressed in WEI
      }
    }

    entity.aTvl = convertBINumToDesiredDecimals(balanceOfCam, entity.decimals);
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
        // https://docs.aave.com/developers/guides/apy-and-apr
        // Rates
        entity.liquidityRate = convertBINumToDesiredDecimals(liquidityRate, 27);
        entity.stableBorrowRate = convertBINumToDesiredDecimals(stableBorrowRate, 27);
        entity.variableBorrowRate = convertBINumToDesiredDecimals(variableBorrowRate, 27);
        entity.liquidityIndex = convertBINumToDesiredDecimals(liquidityIndex, 27);
        entity.variableBorrowRate = convertBINumToDesiredDecimals(variableBorrowIndex, 27);
      }
    }
  }
  let camTokenTotalLiquidityResult = camContract.try_totalSupply();
  if (camTokenTotalLiquidityResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    entity.totalLiquidity = camTokenTotalLiquidityResult.value;
  }
  entity.save();
}
