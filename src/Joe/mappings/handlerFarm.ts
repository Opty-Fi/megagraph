import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { JoeFarmData } from "../../../generated/schema";
import { JoeMasterChefJoeV3 as MasterChefJoeV3Contract } from "../../../generated/JoeMasterChefJoeV3/JoeMasterChefJoeV3";
import { JoeMasterChefJoeV2 as MasterChefJoeV2Contract } from "../../../generated/JoeMasterChefJoeV2/JoeMasterChefJoeV2";

// Is the same abi for both versions
import { JoeSimpleRewarderPerSec as RewarderContract } from "../../../generated/JoeMasterChefJoeV2/JoeSimpleRewarderPerSec";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { JoeMasterChefV2Address, JoeMasterChefV3Address, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handlePool(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  eventType: string,
  version: string,
  lpToken: Address,
): void {
  let entity = JoeFarmData.load(txnHash.toHex());
  if (!entity) entity = new JoeFarmData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.poolId = poolId;

  entity.event = eventType;
  entity.version = version;

  let poolAllocPoints = ZERO_BI;
  let poolJoePerSec = ZERO_BD;
  let totalJoePerSec = ZERO_BD;
  let totalAllocPoints = ZERO_BI;
  let poolLastRewardTimestamp = ZERO_BI;
  let poolAccJoePerShare = ZERO_BD;
  let poolLpToken = ZERO_ADDRESS;
  let rewarderAddress = ZERO_ADDRESS;

  if (version == "2") {
    let contract = MasterChefJoeV2Contract.bind(JoeMasterChefV2Address);
    let totalJoePerSecResult = contract.try_joePerSec();

    if (totalJoePerSecResult.reverted) {
    } else {
      totalJoePerSec = convertBINumToDesiredDecimals(totalJoePerSecResult.value, 18);
    }

    let totalAllocPointResult = contract.try_totalAllocPoint();
    if (totalAllocPointResult.reverted) {
      log.warning("totalAllocPoint() reverted", []);
    } else {
      totalAllocPoints = totalAllocPointResult.value;
    }

    let poolInfoResult = contract.try_poolInfo(poolId);
    if (poolInfoResult.reverted) {
    } else {
      let poolInfo = poolInfoResult.value;
      poolLpToken = poolInfo.value0;
      poolAllocPoints = poolInfo.value1;
      poolLastRewardTimestamp = poolInfo.value2;
      poolAccJoePerShare = convertBINumToDesiredDecimals(poolInfo.value3, 18);
      rewarderAddress = poolInfo.value4;
    }
  } else if (version == "3") {
    let contract = MasterChefJoeV3Contract.bind(JoeMasterChefV3Address);
    let totalJoePerSecResult = contract.try_joePerSec();

    if (totalJoePerSecResult.reverted) {
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
    }
    let poolInfo = poolResult.value;
    poolLpToken = poolInfo.value0;
    poolAllocPoints = poolInfo.value1;
    poolLastRewardTimestamp = poolInfo.value2;
    poolAccJoePerShare = convertBINumToDesiredDecimals(poolInfo.value3, 18);
  }
  if (totalAllocPoints > ZERO_BI) {
    poolJoePerSec = totalJoePerSec.times(poolAllocPoints.toBigDecimal()).div(totalAllocPoints.toBigDecimal());
  }
  // Rewards
  let rewarderContract = RewarderContract.bind(rewarderAddress);
  let rewarderTokenResult = rewarderContract.try_rewardToken();
  entity.rewardToken = rewarderTokenResult.reverted ? ZERO_ADDRESS : rewarderTokenResult.value;

  let poolRewardPerSecondResult = rewarderContract.try_tokenPerSec();
  let tempRewardPerSec = poolRewardPerSecondResult.reverted ? ZERO_BI : poolRewardPerSecondResult.value;
  entity.rewardPerSecond = convertBINumToDesiredDecimals(tempRewardPerSec, 18);

  entity.accJoePerShare = poolAccJoePerShare;
  entity.lastRewardTime = poolLastRewardTimestamp;
  entity.joePerSecond = poolJoePerSec;
  entity.lpToken = lpToken != null ? lpToken : poolLpToken;

  entity.save();
}
