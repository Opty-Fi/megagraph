import { log, Bytes, Address, BigInt } from "@graphprotocol/graph-ts";
import { CurveLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGauge";
import { CurveLiquidityGaugeV2 } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGaugeV2";
import { CurveStakingLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingLiquidityGauge";
import { CurveRegistry } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRegistry";
import { CurveRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRewards";
import { CurveMultiRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveMultiRewards";
import { CurveStakingRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingRewards";
import { CurveExtraReward, CurvePoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress, convertToLowerCase, toAddress } from "../../utils/converters";
import { CurveRegistryAddress, ZERO_BI, ZERO_ADDRESS } from "../../utils/constants";

// Liquidity Gauge - reward_tokens, reward_data
let v1Pools: Array<string> = [
  convertToLowerCase("0x5a6A4D54456819380173272A5E8E9B9904BdF41B"), // mim -> SPELL
];

// Liquidity Gauge V2 - reward_tokens, reward_contract
let v2Pools: Array<string> = [
  convertToLowerCase("0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"), // steth -> LDO
  convertToLowerCase("0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B"), // frax -> FXS
  convertToLowerCase("0x42d7025938bEc20B69cBae5A77421082407f053A"), // usdp -> DUCK
  convertToLowerCase("0xd81dA8D904b52208541Bade1bD6595D8a251F8dd"), // obtc -> BOR
  convertToLowerCase("0xd7d147c6Bb90A718c3De8C0568F9B560C79fa416"), // pbtc -> PNT
];

// Liquidity Gauge V2 + MultiRewards
let v2PoolsMulti: Array<string> = [
  convertToLowerCase("0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2"), // ankreth -> ANKR + ONX
];

// Liquidity Gauge V3 - reward_tokens, reward_contract (same as V2)
let v3Pools: Array<string> = [
  convertToLowerCase("0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c"), // alusd -> ALCX
  convertToLowerCase("0xF9440930043eb3997fc70e1339dBb11F341de7A8"), // reth -> FIS
];

// Staking Liqudity Gauge - rewarded_token, reward_contract
let stakingPools: Array<string> = [
  convertToLowerCase("0xA5407eAE9Ba41422680e2e00537571bcC53efBfD"), // susdv2 -> SNX
  convertToLowerCase("0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6"), // musd -> MTA
  convertToLowerCase("0xC18cC39da8b11dA8c3541C598eE022258F9744da"), // rsv -> RSR
  convertToLowerCase("0x8038C01A0390a8c547446a0b2c18fc9aEFEcc10c"), // dusd -> DFD
];

// TODO: Aave Pools
let aavePools: Array<string> = [
  // saave -> stkAAVE
  convertToLowerCase("0xEB16Ae0052ed37f479f7fe63849198Df1765a733"), "TODO",

  // aave -> stkAAVE
  convertToLowerCase("0xDeBF20617708857ebe4F679508E7b7863a8A8EeE"), "TODO",
];

// Factory Pools - Liquidity Gauge (reward_tokens, reward_data)
let factoryPools: Array<string> = [ // TODO: object gives compile error
  // 2: f-ibkrw -> rKP3R
  convertToLowerCase("0x8461A004b50d321CB22B7d034969cE6803911899"), "0x1750a3a3d80A3F5333BBe9c4695B0fAd41061ab1",

  // 3: f-ibeur -> rKP3R
  convertToLowerCase("0x19b080FE1ffA0553469D20Ca36219F17Fcf03859"), "0x99fb76F75501039089AAC8f20f487bf84E51d76F",

  // 9: ousd -> OGN
  convertToLowerCase("0x87650D7bbfC3A9F10587d7778206671719d9910D"), "0x25f0cE4E2F8dbA112D9b115710AC297F816087CD",

  // 28: f-ibjpy -> rKP3R
  convertToLowerCase("0x8818a9bb44Fbf33502bE7c15c500d0C783B73067"), "0xeFF437A56A22D7dD86C1202A308536ED8C7da7c1",

  // 29: f-ibaud -> rKP3R
  convertToLowerCase("0x3F1B0278A9ee595635B61817630cC19DE792f506"), "0x05ca5c01629a8E5845f12ea3A03fF7331932233A",

  // 30: f-ibgbp -> rKP3R
  convertToLowerCase("0xD6Ac1CB9019137a896343Da59dDE6d097F710538"), "0x63d9f3aB7d0c528797A12a0684E50C397E9e79dC",

  // 31: f-ibchf -> rKP3R
  convertToLowerCase("0x9c2C8910F113181783c249d8F6Aa41b51Cde0f0c"), "0x2fA53e8fa5fAdb81f4332C8EcE39Fe62eA2f919E",
];

export function getExtras(entity: CurvePoolData, txnHash: Bytes): string[] {
  let address = convertToLowerCase(entity.vault.toHexString());
  let index = factoryPools.indexOf(address);
  if (v1Pools.includes(address)) {
    return v1Pool(entity, txnHash);
  } else if (stakingPools.includes(address)) {
    return stakingPool(entity, txnHash);
  } else if (v2Pools.includes(address)) {
    return v2Pool(entity, txnHash);
  } else if (v2PoolsMulti.includes(address)) {
    return v2PoolMulti(entity, txnHash);
  } else if (v3Pools.includes(address)) {
    // V3 same ABI as V2 (for our calls)
    return v2Pool(entity, txnHash);
  } else if (index > -1) {
    let gauge = factoryPools[index + 1];
    return factoryPool(entity, toAddress(gauge), txnHash);
  } else if (aavePools.includes(address)) {
    log.warning("aavePools not implemented", []);
    return [];
  } else if (v3Pools.includes(address)) {
    log.warning("v3Pool not implemented", []);
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
  return factoryPool(entity, gaugeAddress, txnHash);
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

function v2PoolMulti(entity: CurvePoolData, txnHash: Bytes): string[] {
  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    return [];
  }

  let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
  let liquidityGaugeV2Contract = CurveLiquidityGaugeV2.bind(gaugeAddress);
  let extras: Array<string> = [];
  let index = ZERO_BI;
  while (1) {
    let rewardTokensResult = liquidityGaugeV2Contract.try_reward_tokens(index);
    index = index.plus(BigInt.fromString("1"));
    if (rewardTokensResult.reverted) {
      log.warning("reward_tokens reverted", []);
      return extras;
    }

    let rewardToken = rewardTokensResult.value;
    if (rewardToken == ZERO_ADDRESS) {
      break;
    }
    let rewardContractResult = liquidityGaugeV2Contract.try_reward_contract();
    if (rewardContractResult.reverted) {
      log.warning("reward_contract reverted", []);
      return extras;
    }

    let rewardContractAddress = convertBytesToAddress(rewardContractResult.value);
    let rewardContract = CurveMultiRewards.bind(rewardContractAddress);
    let rewardDataResult = rewardContract.try_rewardData(rewardToken);
    if (rewardDataResult.reverted) {
      log.warning("rewardData reverted", []);
      return extras;
    }

    let periodFinish = rewardDataResult.value.value2;
    let rewardRate   = rewardDataResult.value.value3;

    let id = txnHash.toHex() + rewardToken.toHexString();
    let extra = new CurveExtraReward(id);
    extra.token = rewardToken;
    extra.finishPeriod = periodFinish;
    extra.rewardRatePerSecond = convertBINumToDesiredDecimals(rewardRate, 18);
    extra.save();

    extras.push(extra.id);
  }

  return extras;
}

function factoryPool(entity: CurvePoolData, gaugeAddress: Address, txnHash: Bytes): string[] {
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