import { BigInt, Address } from "@graphprotocol/graph-ts";
import { ConvexExtraRewardStashV1 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV1";
import { ConvexExtraRewardStashV2 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV2";
import { ConvexExtraRewardStashV3 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV3";
import { ConvexExtraRewardStashV31 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV31";
import { ConvexVirtualBalanceRewardsPool } from "../../../generated/ConvexBooster/ConvexVirtualBalanceRewardsPool";
import { ConvexExtraReward, ConvexPoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { ZERO_BD, ZERO_BI } from "../../utils/constants";

export function getExtras(pool: ConvexPoolData, tx: string): string[] {
  if (pool.stashVersion == "V1") {
    return getExtrasV1(pool, tx);
  } else if (pool.stashVersion == "V2") {
    return getExtrasV2(pool, tx);
  } else if (pool.stashVersion == "V3") {
    return getExtrasV3(pool, tx);
  } else {
    return getExtrasV31(pool, tx);
  }
}

function getExtrasV1(pool: ConvexPoolData, tx: string): string[] {
  let stashContract = ConvexExtraRewardStashV1.bind(convertBytesToAddress(pool.stash));
  let tokenInfo = stashContract.try_tokenInfo();
  if (tokenInfo.reverted) {
    return [];
  }

  let rewardToken = tokenInfo.value.value0;
  let rewardPool  = tokenInfo.value.value1;
  let extra = createExtraReward(rewardToken, rewardPool, tx);

  return [extra];
}

function getExtrasV2(pool: ConvexPoolData, tx: string): string[] {
  let extras: string[] = [];

  let stashContract = ConvexExtraRewardStashV2.bind(convertBytesToAddress(pool.stash));
  let tokenCount = stashContract.try_tokenCount();
  if (!tokenCount.reverted) {
    for (let i = 0; i < tokenCount.value.toI32(); i++) {
      let tokenInfo = stashContract.try_tokenInfo(BigInt.fromI32(i));
      if (!tokenInfo.reverted) {
        let rewardToken = tokenInfo.value.value0;
        let rewardPool  = tokenInfo.value.value1;
        let extra = createExtraReward(rewardToken, rewardPool, tx);
        extras.push(extra);
      }
    }
  }

  return extras;
}

function getExtrasV3(pool: ConvexPoolData, tx: string): string[] {
  let extras: string[] = [];

  let stashContract = ConvexExtraRewardStashV3.bind(convertBytesToAddress(pool.stash));
  let tokenCount = stashContract.try_tokenCount();
  if (!tokenCount.reverted) {
    for (let i = 0; i < tokenCount.value.toI32(); i++) {
      let tokenInfo = stashContract.try_tokenInfo(BigInt.fromI32(i));
      if (!tokenInfo.reverted) {
        let rewardToken = tokenInfo.value.value0;
        let rewardPool  = tokenInfo.value.value1;
        let extra = createExtraReward(rewardToken, rewardPool, tx);
        extras.push(extra);
      }
    }
  }

  return extras;
}

function getExtrasV31(pool: ConvexPoolData, tx: string): string[] {
  let extras: string[] = [];

  let stashContract = ConvexExtraRewardStashV31.bind(convertBytesToAddress(pool.stash));
  let tokenCount = stashContract.try_tokenCount();
  if (!tokenCount.reverted) {
    for (let i = 0; i < tokenCount.value.toI32(); i++) {
      let tokenList = stashContract.try_tokenList(BigInt.fromI32(i));
      if (!tokenList.reverted) {
        let tokenInfo = stashContract.try_tokenInfo(tokenList.value);
        if (!tokenInfo.reverted) {
          let rewardToken = tokenInfo.value.value0;
          let rewardPool  = tokenInfo.value.value1;
          let extra = createExtraReward(rewardToken, rewardPool, tx);
          extras.push(extra);
        }
      }
    }
  }

  return extras;
}

function createExtraReward(rewardToken: Address, rewardPool: Address, tx: string): string {
  let rewardPoolContract = ConvexVirtualBalanceRewardsPool.bind(rewardPool);
  let finishPeriodResult = rewardPoolContract.try_periodFinish();
  let finishPeriod = finishPeriodResult.reverted ? ZERO_BI : finishPeriodResult.value;

  let rewardRateResult = rewardPoolContract.try_rewardRate();
  let rewardRate = rewardRateResult.reverted ? ZERO_BD :
    convertBINumToDesiredDecimals(rewardRateResult.value, 18);

  let id = tx + rewardToken.toHexString();
  let extra = new ConvexExtraReward(id);
  extra.token = rewardToken;
  extra.rewardPool = rewardPool;
  extra.finishPeriod = finishPeriod;
  extra.rewardRatePerSecond = rewardRate;
  extra.save();

  return extra.id;
}