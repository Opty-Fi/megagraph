import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { MaiCamTokenData } from "../../../generated/schema";
import { MaiAToken } from "../../../generated/MaiCamAavecamAAVE/MaiAToken";
import { MaiLendingPool } from "../../../generated/MaiCamAavecamAAVE/MaiLendingPool";
import { convertBINumToDesiredDecimals, toAddress } from "../../utils/converters";

import { MaiIncentivesController } from "../../../generated/MaiCamTokencamUSDC/MaiIncentivesController";
import { ZERO_BD, ZERO_BI, CAM_INCENTIVES_CONTROLLER_ADDRESS, CAM_LENDING_POOL_ADDRESS } from "../../utils/constants";

export function handleCamToken(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  camTokenAddress: Address,
  reserveAddress: Address,
  amTokenAddress: Address,
  decimals: i32,
  symbol: string,
  totalLiquidity: BigInt,
): void {
  let aTvl = ZERO_BI;
  let aEmissionPerSecond = ZERO_BI;
  let liquidityRate = ZERO_BD;
  let liquidityIndex = ZERO_BD;
  let stableBorrowRate = ZERO_BD;
  let variableBorrowIndex = ZERO_BD;
  let variableBorrowRate = ZERO_BD;

  let amATokenContract = MaiAToken.bind(amTokenAddress);
  let amBalanceResult = amATokenContract.try_balanceOf(camTokenAddress);
  if (amBalanceResult.reverted) {
    log.warning("try_balanceOf(camAddress) reverted", []);
  } else {
    aTvl = amBalanceResult.value;
  }
  let incentivesControllerContract = MaiIncentivesController.bind(CAM_INCENTIVES_CONTROLLER_ADDRESS);
  let assetsResult = incentivesControllerContract.try_assets(amTokenAddress);
  if (assetsResult.reverted) {
    log.error("AaveincentivesControler at {} call assets({}) reverted", [
      incentivesControllerContract._address.toHex(),
      camTokenAddress.toHex(),
    ]);
  } else {
    let assets = assetsResult.value;
    // https://docs.aave.com/developers/guides/apy-and-apr
    aEmissionPerSecond = assets.value0; //emissionPerSecond, expressed in WEI
  }
  let lendingPoolContract = MaiLendingPool.bind(CAM_LENDING_POOL_ADDRESS);
  let camTokenReserveDataResult = lendingPoolContract.try_getReserveData(reserveAddress);
  if (camTokenReserveDataResult.reverted) {
    log.error("try_getReserveData() reverted", []);
  } else {
    let camTokenConfiguration = camTokenReserveDataResult.value;
    // Rates: https://docs.aave.com/developers/guides/apy-and-apr
    let DECIMALS: i32 = 27;
    liquidityIndex = convertBINumToDesiredDecimals(camTokenConfiguration.liquidityIndex, DECIMALS);
    liquidityRate = convertBINumToDesiredDecimals(camTokenConfiguration.currentLiquidityRate, DECIMALS);
    stableBorrowRate = convertBINumToDesiredDecimals(camTokenConfiguration.currentStableBorrowRate, DECIMALS);
    variableBorrowIndex = convertBINumToDesiredDecimals(camTokenConfiguration.variableBorrowIndex, DECIMALS);
    variableBorrowRate = convertBINumToDesiredDecimals(camTokenConfiguration.currentVariableBorrowRate, DECIMALS);
  }
  // handling the entity
  let entity = MaiCamTokenData.load(txnHash.toHex());
  if (!entity) entity = new MaiCamTokenData(txnHash.toHex());
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.address = camTokenAddress;
  entity.aTvl = aTvl;
  entity.symbol = symbol;
  entity.decimals = decimals;
  entity.totalLiquidity = totalLiquidity;
  entity.aEmissionPerSecond = aEmissionPerSecond;
  entity.aTokenAddress = amTokenAddress;
  entity.liquidityIndex = liquidityIndex;
  entity.liquidityRate = liquidityRate;
  entity.stableBorrowRate = stableBorrowRate;
  entity.variableBorrowIndex = variableBorrowIndex;
  entity.variableBorrowRate = variableBorrowRate;

  entity.save();
  // end handling
}
