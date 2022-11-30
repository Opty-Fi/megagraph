import {
  PoolAdded as PoolAddedEvent,
  PoolSet as PoolSetEvent,
  PoolUpdate as PoolUpdateEvent,
} from "../../../generated/PangolinMiniChefV2/PangolinMiniChefV2";
import { handleFarmEvent } from "./handleFarmEntity";

export function handlePoolAdded(event: PoolAddedEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let lpToken = event.params.lpToken;
  let eventType = "PoolAdded";
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, lpToken);
}
export function handlePoolSet(event: PoolSetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "PoolSet";
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null);
}
export function handlePoolUpdate(event: PoolUpdateEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "PoolUpdate";
  let lpSupply = event.params.lpSupply;
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null);
}
