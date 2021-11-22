import { log, Bytes, Address, BigInt } from "@graphprotocol/graph-ts";
import { CurveLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGauge";
import { CurveLiquidityGaugeV2 } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveLiquidityGaugeV2";
import { CurveStakingLiquidityGauge } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingLiquidityGauge";
import { CurveRegistry } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRegistry";
import { CurveRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveRewards";
import { CurveMultiRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveMultiRewards";
import { CurveStakingRewards } from "../../../generated/CurvePoolX2cDAI+cUSDC/CurveStakingRewards";
import { CurveExtraReward, CurvePoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress, toAddress } from "../../utils/converters";
import { CurveRegistryAddress, ZERO_BI, ZERO_ADDRESS } from "../../utils/constants";

// Liquidity Gauge - reward_tokens, reward_data
let v1Pools: Array<string> = [
  "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", "0x5a6a4d54456819380173272a5e8e9b9904bdf41b", // mim -> SPELL
];

// Liquidity Gauge V2 - reward_tokens, reward_contract
let v2Pools: Array<string> = [
  "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022", "0xdc24316b9ae028f1497c275eb9192a3ea0f67022", // steth -> LDO
  "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B", "0xd632f22692fac7611d2aa1c0d552930d43caed3b", // frax -> FXS
  "0x42d7025938bEc20B69cBae5A77421082407f053A", "0x42d7025938bec20b69cbae5a77421082407f053a", // usdp -> DUCK
  "0xd81dA8D904b52208541Bade1bD6595D8a251F8dd", "0xd81da8d904b52208541bade1bd6595d8a251f8dd", // obtc -> BOR
  "0xd7d147c6Bb90A718c3De8C0568F9B560C79fa416", "0xd7d147c6bb90a718c3de8c0568f9b560c79fa416", // pbtc -> PNT
];

// Liquidity Gauge V2 + MultiRewards
let v2PoolsMulti: Array<string> = [
  "0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2", "0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2", // ankreth -> ANKR + ONX
];

// Liquidity Gauge V3 - reward_tokens, reward_contract (same as V2)
let v3Pools: Array<string> = [
  "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c", "0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c", // alusd -> ALCX
  "0xF9440930043eb3997fc70e1339dBb11F341de7A8", "0xf9440930043eb3997fc70e1339dbb11f341de7a8", // reth -> FIS
];

// Staking Liqudity Gauge - rewarded_token, reward_contract
let stakingPools: Array<string> = [
  "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD", "0xa5407eae9ba41422680e2e00537571bcc53efbfd", // susdv2 -> SNX
  "0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6", "0x8474ddbe98f5aa3179b3b3f5942d724afcdec9f6", // musd -> MTA
  "0xC18cC39da8b11dA8c3541C598eE022258F9744da", "0xc18cc39da8b11da8c3541c598ee022258f9744da", // rsv -> RSR
  "0x8038C01A0390a8c547446a0b2c18fc9aEFEcc10c", "0x8038c01a0390a8c547446a0b2c18fc9aefecc10c", // dusd -> DFD
];

// TODO: Aave
let aavePools: Array<string> = [
  "0xEB16Ae0052ed37f479f7fe63849198Df1765a733", "0xeb16ae0052ed37f479f7fe63849198df1765a733", // saave -> stkAAVE
  "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE", "0xdebf20617708857ebe4f679508e7b7863a8a8eee", // aave -> stkAAVE
];

// Factory Pools - Liquidity Gauge (reward_tokens, reward_data)
let factoryPools: Array<string> = [ // TODO: object gives compile error
  // 2: f-ibkrw -> rKP3R
  "0x8461A004b50d321CB22B7d034969cE6803911899", "0x1750a3a3d80A3F5333BBe9c4695B0fAd41061ab1",
  "0x8461a004b50d321cb22b7d034969ce6803911899", "0x1750a3a3d80A3F5333BBe9c4695B0fAd41061ab1",

  // 3: f-ibeur -> rKP3R
  "0x19b080FE1ffA0553469D20Ca36219F17Fcf03859", "0x99fb76F75501039089AAC8f20f487bf84E51d76F",
  "0x19b080fe1ffa0553469d20ca36219f17fcf03859", "0x99fb76F75501039089AAC8f20f487bf84E51d76F",

  // 9: ousd -> OGN
  "0x87650D7bbfC3A9F10587d7778206671719d9910D", "0x25f0cE4E2F8dbA112D9b115710AC297F816087CD",
  "0x87650d7bbfc3a9f10587d7778206671719d9910d", "0x25f0cE4E2F8dbA112D9b115710AC297F816087CD",

  // 28: f-ibjpy -> rKP3R
  "0x8818a9bb44Fbf33502bE7c15c500d0C783B73067", "0xeFF437A56A22D7dD86C1202A308536ED8C7da7c1",
  "0x8818a9bb44fbf33502be7c15c500d0c783b73067", "0xeFF437A56A22D7dD86C1202A308536ED8C7da7c1",

  // 29: f-ibaud -> rKP3R
  "0x3F1B0278A9ee595635B61817630cC19DE792f506", "0x05ca5c01629a8E5845f12ea3A03fF7331932233A",
  "0x3f1b0278a9ee595635b61817630cc19de792f506", "0x05ca5c01629a8E5845f12ea3A03fF7331932233A",

  // 30: f-ibgbp -> rKP3R
  "0xD6Ac1CB9019137a896343Da59dDE6d097F710538", "0x63d9f3aB7d0c528797A12a0684E50C397E9e79dC",
  "0xd6ac1cb9019137a896343da59dde6d097f710538", "0x63d9f3aB7d0c528797A12a0684E50C397E9e79dC",

  // 31: f-ibchf -> rKP3R
  "0x9c2C8910F113181783c249d8F6Aa41b51Cde0f0c", "0x2fA53e8fa5fAdb81f4332C8EcE39Fe62eA2f919E",
  "0x9c2c8910f113181783c249d8f6aa41b51cde0f0c", "0x2fA53e8fa5fAdb81f4332C8EcE39Fe62eA2f919E",
];

export function getExtras(entity: CurvePoolData, txnHash: Bytes): string[] {
  let address = entity.vault.toHexString();
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