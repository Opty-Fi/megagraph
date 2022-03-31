import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PangolinFarmData, PangolinFarmReward } from "../../../generated/schema";
import { PangolinMiniChefV2 as PangolinMiniChefContract } from "../../../generated/PangolinMiniChefV2/PangolinMiniChefV2";

// Is the same abi for both versions
import { PangolinRewarderViaMultiplier as PangolinRewarderContract } from "../../../generated/PangolinMiniChefV2/PangolinRewarderViaMultiplier";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { PANGOLIN_MINICHEFV2_ADDRESS, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../../utils/constants";
export function handleFarmEvent(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  eventType: string,
  lpToken: Address,
  amount: BigInt,
  lpSupply: BigInt,
): void {
  let entity = PangolinFarmData.load(txnHash.toHex());
  if (!entity) entity = new PangolinFarmData(txnHash.toHex());
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.poolId = poolId;
  entity.event = eventType;
  entity.lpToken = lpToken;

  let poolAllocPoints = ZERO_BI;
  let totalAllocPoints = ZERO_BI;
  let totalPngPerSecond = ZERO_BD;
  let rewarderAddress = ZERO_ADDRESS;
  let farmContract = PangolinMiniChefContract.bind(PANGOLIN_MINICHEFV2_ADDRESS);

  let lpTokensResult = farmContract.try_lpTokens();
  if (lpTokensResult.reverted) {
    log.warning("lp_tokens() reverted", []);
  } else {
    let lpTokens = lpTokensResult.value;
    entity.lpToken = lpTokens[poolId.toI32()];
  }

  let totalPngPerSecondResult = farmContract.try_rewardPerSecond();
  if (totalPngPerSecondResult.reverted) {
    log.warning("rewardPerSecond() reverted", []);
  } else {
    totalPngPerSecond = convertBINumToDesiredDecimals(totalPngPerSecondResult.value, 18);
  }
  let totalAllocPointResult = farmContract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoints = totalAllocPointResult.value;
  }

  let poolInfoResult = farmContract.try_poolInfo(poolId);
  if (poolInfoResult.reverted) {
    log.warning("poolInfo() reverted", []);
  } else {
    let poolInfo = poolInfoResult.value;
    entity.lastRewardTime = poolInfo.value1;
    poolAllocPoints = poolInfo.value2;
    entity.accRewardPerShare = convertBINumToDesiredDecimals(poolInfo.value0, 18);
    if (totalAllocPoints > ZERO_BI) {
      entity.pngPerSecond = totalPngPerSecond
        .times(poolAllocPoints.toBigDecimal())
        .div(totalAllocPoints.toBigDecimal());
    }
  }
  let rewarderResult = farmContract.try_rewarder(poolId);
  if (rewarderResult.reverted) {
    log.warning("try_rewarder({}) reverted", [poolId.toString()]);
  } else {
    rewarderAddress = rewarderResult.value;
    log.warning("try_rewarder({}) not reverted, {}", [poolId.toString(), rewarderAddress.toHexString()]);
  }

  // Rewards
  if (rewarderAddress != ZERO_ADDRESS) {
    //log.debug("Inside rewards,poolid{}-rewardAddressHexString{}", [poolId.toString(), rewarderAddress.toHexString()]);

    let additionalRewards: Array<PangolinFarmReward> = new Array<PangolinFarmReward>();
    let rewarderContract = PangolinRewarderContract.bind(rewarderAddress);
    let rewardIds: Array<String> = [];
    let multipliersResult = rewarderContract.try_getRewardMultipliers();
    let rewardTokensResult = rewarderContract.try_getRewardTokens();

    if (rewardTokensResult.reverted) {
      log.warning("try_getRewardTokens() on {} reverted", [rewarderAddress.toHexString()]);
    } else {
      let rewardTokens = rewardTokensResult.value;
      //log.debug("{} rewardTokensResultValue[]", [rewardTokens.toString()]);

      for (let i = 0; i < rewardTokens.length; i++) {
        //   log.debug("rewardTokens[],poolid{}-iesimaAddress{}", [poolId.toHexString(), rewardTokens[i].toHexString()]);
        let reward = new PangolinFarmReward(poolId.toHexString() + "-" + rewardTokens[i].toHexString());
        reward.rewardToken = rewardTokens[i];
        reward.save();
        additionalRewards.push(reward);
        rewardIds.push(reward.id);
      }
    }
    if (multipliersResult.reverted) {
      log.warning("try_getRewardMultipliers() on {} reverted", [rewarderAddress.toHexString()]);
    } else {
      let rewardMultipliers = multipliersResult.value;
      for (let i = 0; i < rewardMultipliers.length; i++) {
        //log.debug("{} rewardTokens[{}],{}", [i.toString(), rewardMultipliers[i].toHexString()]);
        let multiplier = convertBINumToDesiredDecimals(rewardMultipliers[i], 18);
        additionalRewards[i].rewardMultiplier = multiplier;
        additionalRewards[i].rewardTokenPerSecond = entity.pngPerSecond.times(multiplier);
        additionalRewards[i].save();
      }
    }
    entity.additionalRewards = rewardIds;
  }

  entity.save();
}
