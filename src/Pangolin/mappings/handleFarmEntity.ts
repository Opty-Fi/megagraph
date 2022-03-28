import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PangolinFarmData } from "../../../generated/schema";
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
}
