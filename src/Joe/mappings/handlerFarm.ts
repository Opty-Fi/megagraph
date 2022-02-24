import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { JoeFarmData } from "../../../generated/schema";
import { JoeMasterChefJoeV3 as MasterChefJoeV3Contract } from "../../../generated/JoeMasterChefJoeV3/JoeMasterChefJoeV3";
import { JoeMasterChefJoeV2 as MasterChefJoeV2Contract } from "../../../generated/JoeMasterChefJoeV2/JoeMasterChefJoeV2";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { JoeMasterChefV2Address, JoeMasterChefV3Address, ZERO_BD, ZERO_BI } from "../../utils/constants";

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
  entity.lpToken = lpToken;
  entity.event = eventType;
  entity.version = version;
  // Reward per second

  if (version == "2") {
    let contract = MasterChefJoeV2Contract.bind(JoeMasterChefV2Address);
    let poolInfoResult = contract.try_poolInfo(poolId);
    if (poolInfoResult.reverted) {
    } else {
      let poolInfo = poolInfoResult.value;
      let pair = poolInfo.value0;
      let allocPoint = poolInfo.value1;
      let lastRewardTimestamp = poolInfo.value2;
      let accJoePerShare = poolInfo.value3;
    }
  } else if (version == "3") {
    let contract = MasterChefJoeV2Contract.bind(JoeMasterChefV3Address);
    let poolResult = contract.try_poolInfo(poolId);
    if (poolResult.reverted) {
    }
    let poolInfo = poolResult.value;
    let pair = poolInfo.value0;
    let allocPoint = poolInfo.value1;
    let lastRewardTimestamp = poolInfo.value2;
    let accJoePerShare = poolInfo.value3;
  }

  entity.save();
}
