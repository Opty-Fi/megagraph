import { log, Bytes } from "@graphprotocol/graph-ts";
import { CurveLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGauge";
import { CurveLiquidityGaugeV2 } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGaugeV2";
import { CurveStakingLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingLiquidityGauge";
import { CurveRegistry } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRegistry";
import { CurveRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRewards";
import { CurveStakingRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingRewards";
import { CurveExtraReward, CurvePoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { CurveRegistryAddress, ZERO_BI } from "../../utils/constants";

// Liquidity Gauge - reward_tokens(), reward_data()
let v1Pools: Array<string> = [
  "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", "0x5a6a4d54456819380173272a5e8e9b9904bdf41b", // mim -> SPELL
];

// TODO: Factory Pools
let factoryV2Pools: Array<string> = [
  "0x87650D7bbfC3A9F10587d7778206671719d9910D", "", // 9 -> OGN
];

// Liquidity Gauge V2 - reward_tokens(), reward_contract()
let v2Pools: Array<string> = [
  "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022", "0xdc24316b9ae028f1497c275eb9192a3ea0f67022", // steth -> LDO
  "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B", "", // frax -> FXS
  "0x42d7025938bEc20B69cBae5A77421082407f053A", "", // usdp -> DUCK
];

// TODO: Liquidity Gauge V3 -
let v3Pools: Array<string> = [
  "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c", "", // alusd -> ALCX
];

// Staking Liqudity Gauge - rewarded_token(), reward_contract()
let stakingPools: Array<string> = [
  "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD", "0xa5407eae9ba41422680e2e00537571bcc53efbfd", // susdv2 -> SNX
];

// TODO: Aave
let aavePools: Array<string> = [
  "0xEB16Ae0052ed37f479f7fe63849198Df1765a733", "0xeb16ae0052ed37f479f7fe63849198df1765a733", // saave -> stkAAVE
  "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE", "", // aave -> stkAAVE
];

export function getExtras(entity: CurvePoolData, txnHash: Bytes): string[] {
  let address = entity.vault.toHexString();
  if (v1Pools.includes(address)) {
    return v1Pool(entity, txnHash);
  } else if (stakingPools.includes(address)) {
    return stakingPool(entity, txnHash);
  } else if (v2Pools.includes(address)) {
    return v2Pool(entity, txnHash);
  } else if (factoryV2Pools.includes(address)) {
    log.warning("factoryV2Pools not implemented", []);
    return [];
  } else if (aavePools.includes(address)) {
    log.warning("aavePools not implemented", []);
    return [];
  }

  return [];
}

function v1Pool(entity: CurvePoolData, txnHash: Bytes): string[] {
  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    return [];
  }

  let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
  let liquidityGaugeContract = CurveLiquidityGauge.bind(gaugeAddress);
  let rewardTokensResult = liquidityGaugeContract.try_reward_tokens(ZERO_BI);
  if (rewardTokensResult.reverted) {
    log.warning("reward_tokens reverted", []);
    return [];
  }

  let rewardToken = rewardTokensResult.value;
  let rewardDataResult = liquidityGaugeContract.try_reward_data(rewardToken);
  if (rewardDataResult.reverted) {
    log.warning("reward_data reverted", []);
    return [];
  }

  let periodFinish = rewardDataResult.value.value2;
  let rewardRate   = rewardDataResult.value.value3;

  let id = txnHash.toHex() + rewardToken.toHexString();
  let extra = new CurveExtraReward(id);
  extra.token = rewardToken;
  extra.finishPeriod = periodFinish;
  extra.rewardRatePerSecond = convertBINumToDesiredDecimals(rewardRate, 18);
  extra.save();

  return [extra.id];
}

function stakingPool(entity: CurvePoolData, txnHash: Bytes): string[] {
  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    return [];
  }

  let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
  let stakingLiquidityGaugeContract = CurveStakingLiquidityGauge.bind(gaugeAddress);
  let rewardedTokenResult = stakingLiquidityGaugeContract.try_rewarded_token();
  if (rewardedTokenResult.reverted) {
    log.warning("rewarded_token reverted", []);
    return [];
  }

  let rewardToken = rewardedTokenResult.value;
  let rewardContractResult = stakingLiquidityGaugeContract.try_reward_contract();
  if (rewardContractResult.reverted) {
    log.warning("reward_contract reverted", []);
    return [];
  }

  let rewardContractAddress = convertBytesToAddress(rewardContractResult.value);
  let rewardContract = CurveRewards.bind(rewardContractAddress);
  let periodFinishResult = rewardContract.try_periodFinish();
  if (periodFinishResult.reverted) {
    log.warning("periodFinish reverted", []);
    return [];
  }

  let periodFinish = periodFinishResult.value;
  let rewardRateResult = rewardContract.try_rewardRate();
  if (rewardRateResult.reverted) {
    log.warning("rewardRate reverted", []);
    return [];
  }

  let rewardRate = rewardRateResult.value;

  let id = txnHash.toHex() + rewardToken.toHexString();
  let extra = new CurveExtraReward(id);
  extra.token = rewardToken;
  extra.finishPeriod = periodFinish;
  extra.rewardRatePerSecond = convertBINumToDesiredDecimals(rewardRate, 18);
  extra.save();

  return [extra.id];
}

function v2Pool(entity: CurvePoolData, txnHash: Bytes): string[] {
  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    return [];
  }

  let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
  let liquidityGaugeV2Contract = CurveLiquidityGaugeV2.bind(gaugeAddress);
  let rewardTokensResult = liquidityGaugeV2Contract.try_reward_tokens(ZERO_BI);
  if (rewardTokensResult.reverted) {
    log.warning("reward_tokens reverted", []);
    return [];
  }

  let rewardToken = rewardTokensResult.value;
  let rewardContractResult = liquidityGaugeV2Contract.try_reward_contract();
  if (rewardContractResult.reverted) {
    log.warning("reward_contract reverted", []);
    return [];
  }

  let rewardContractAddress = convertBytesToAddress(rewardContractResult.value);
  let rewardContract = CurveStakingRewards.bind(rewardContractAddress);
  let periodFinishResult = rewardContract.try_periodFinish();
  if (periodFinishResult.reverted) {
    log.warning("periodFinish reverted", []);
    return [];
  }

  let periodFinish = periodFinishResult.value;
  let rewardRateResult = rewardContract.try_rewardRate();
  if (rewardRateResult.reverted) {
    log.warning("rewardRate reverted", []);
    return [];
  }

  let rewardRate = rewardRateResult.value;

  let id = txnHash.toHex() + rewardToken.toHexString();
  let extra = new CurveExtraReward(id);
  extra.token = rewardToken;
  extra.finishPeriod = periodFinish;
  extra.rewardRatePerSecond = convertBINumToDesiredDecimals(rewardRate, 18);
  extra.save();

  return [extra.id];
}