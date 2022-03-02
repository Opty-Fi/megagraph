import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { TraderJoeFarmData } from "../../../generated/schema";
import { TraderJoeMasterChefJoeV3 as MasterChefJoeV3Contract } from "../../../generated/TraderJoeMasterChefJoeV3/TraderJoeMasterChefJoeV3";
import { TraderJoeMasterChefJoeV2 as MasterChefJoeV2Contract } from "../../../generated/TraderJoeMasterChefJoeV2/TraderJoeMasterChefJoeV2";

// Is the same abi for both versions
import { TraderJoeSimpleRewarderPerSec as RewarderContract } from "../../../generated/TraderJoeMasterChefJoeV2/TraderJoeSimpleRewarderPerSec";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import {
  JOE_MASTER_CHEF_V2_ADDRESS,
  JOE_MASTER_CHEF_V3_ADDRESS,
  ZERO_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from "../../utils/constants";

export function handlePool(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  eventType: string,
  version: string,
  lpToken: Address,
): void {
  let entity = TraderJoeFarmData.load(txnHash.toHex());
  if (!entity) entity = new TraderJoeFarmData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.poolId = poolId;

  entity.event = eventType;
  entity.version = version;

  if (version == "V2") {
    entity = updateEntityV2(entity as TraderJoeFarmData, poolId);
  } else if (version == "V3") {
    entity = updateEntityV3(entity as TraderJoeFarmData, poolId);
  }

  // Rewards
  let rewardAddress = convertBytesToAddress(entity.rewarder);
  let rewarderContract = RewarderContract.bind(rewardAddress);
  let rewarderTokenResult = rewarderContract.try_rewardToken();
  if (rewarderTokenResult.reverted) {
    log.warning("rewardToken() reverted", []);
    entity.rewardToken = ZERO_ADDRESS;
  } else {
    entity.rewardToken = rewarderTokenResult.value;
  }

  let poolRewardPerSecondResult = rewarderContract.try_tokenPerSec();
  if (poolRewardPerSecondResult.reverted) {
    log.warning("rewardPerSec() reverted", []);
    entity.rewardPerSecond = ZERO_BD;
  } else {
    entity.rewardPerSecond = convertBINumToDesiredDecimals(poolRewardPerSecondResult.value, 18);
  }

  if (lpToken != null) {
    entity.lpToken = lpToken;
  }
  entity.save();
}

function updateEntityV2(entity: TraderJoeFarmData, poolId: BigInt): TraderJoeFarmData {
  let poolAllocPoints = ZERO_BI;
  let totalJoePerSec = ZERO_BD;
  let totalAllocPoints = ZERO_BI;
  let contract = MasterChefJoeV2Contract.bind(JOE_MASTER_CHEF_V2_ADDRESS);

  let totalJoePerSecResult = contract.try_joePerSec();
  if (totalJoePerSecResult.reverted) {
    log.warning("joePerSec() reverted", []);
  } else {
    totalJoePerSec = convertBINumToDesiredDecimals(totalJoePerSecResult.value, 18);
  }
  let totalAllocPointResult = contract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoints = totalAllocPointResult.value;
  }
  let poolResult = contract.try_poolInfo(poolId);
  if (poolResult.reverted) {
    log.warning("poolInfo() reverted", []);
  } else {
    let poolInfo = poolResult.value;
    entity.lpToken = poolInfo.value0;
    poolAllocPoints = poolInfo.value1;
    entity.lastRewardTime = poolInfo.value2;
    entity.accJoePerShare = convertBINumToDesiredDecimals(poolInfo.value3, 18);
    if (totalAllocPoints > ZERO_BI) {
      entity.joePerSecond = totalJoePerSec.times(poolAllocPoints.toBigDecimal()).div(totalAllocPoints.toBigDecimal());
    }
    entity.rewarder = poolInfo.value4;
  }
  return entity;
}

function updateEntityV3(entity: TraderJoeFarmData, poolId: BigInt): TraderJoeFarmData {
  let poolAllocPoints = ZERO_BI;
  let totalJoePerSec = ZERO_BD;
  let totalAllocPoints = ZERO_BI;
  let contract = MasterChefJoeV3Contract.bind(JOE_MASTER_CHEF_V3_ADDRESS);

  let totalJoePerSecResult = contract.try_joePerSec();
  if (totalJoePerSecResult.reverted) {
    log.warning("joePerSec() reverted", []);
  } else {
    totalJoePerSec = convertBINumToDesiredDecimals(totalJoePerSecResult.value, 18);
  }
  let totalAllocPointResult = contract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoints = totalAllocPointResult.value;
  }
  let poolResult = contract.try_poolInfo(poolId);
  if (poolResult.reverted) {
    log.warning("poolInfo() reverted", []);
  } else {
    let poolInfo = poolResult.value;
    entity.lpToken = poolInfo.value0;
    poolAllocPoints = poolInfo.value1;
    entity.lastRewardTime = poolInfo.value2;
    entity.accJoePerShare = convertBINumToDesiredDecimals(poolInfo.value3, 18);
    if (totalAllocPoints > ZERO_BI) {
      entity.joePerSecond = totalJoePerSec.times(poolAllocPoints.toBigDecimal()).div(totalAllocPoints.toBigDecimal());
    }
    entity.rewarder = poolInfo.value4;
  }

  return entity;
}
