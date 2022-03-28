import { Address } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Harvest as HarvestEvent,
  PoolAdded as PoolAddedEvent,
  PoolSet as PoolSetEvent,
  PoolUpdate as PoolUpdateEvent,
} from "../../../generated/PangolinMiniChefV2/PangolinMiniChefV2";
import { handleFarmEvent } from "./handleFarmEntity";

export function handleDeposit(event: DepositEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let amount = event.params.amount;
  let eventType = "Deposit";

  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null, amount, null);
}
export function handleWithdraw(event: WithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Withdraw";
  let amount = event.params.amount;
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null, amount, null);
}
export function handleHarvest(event: HarvestEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let amount = event.params.amount;
  let eventType = "Harvest";
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null, amount, null);
}
export function handlePoolAdded(event: PoolAddedEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let lpToken = event.params.lpToken;
  let eventType = "PoolAdded";
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, lpToken, null, null);
}
export function handlePoolSet(event: PoolSetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "PoolSet";
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null, null, null);
}
export function handlePoolUpdate(event: PoolUpdateEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "PoolUpdate";
  let lpSupply = event.params.lpSupply;
  handleFarmEvent(txnHash, blockNumber, timestamp, poolId, eventType, null, null, lpSupply);
}
