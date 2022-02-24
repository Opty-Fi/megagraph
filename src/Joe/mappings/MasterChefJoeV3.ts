import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  JoeMasterChefJoeV3 as MasterChefJoeV3Contract,
  Withdraw as WithdrawEvent,
} from "../../../generated/JoeMasterChefJoeV3/JoeMasterChefJoeV3";
import { handlePool } from "./handlerFarm";

export function handleAdd(event: AddEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Add";
  let lpToken: Address = event.params.lpToken;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "3", lpToken);
}
export function handleSet(event: SetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Set";
  let lpToken = null;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "3", null);
}
export function handleDeposit(event: DepositEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Deposit";
  let lpToken = null;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "3", null);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "EmergencyWithdraw";
  let lpToken = null;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "3", null);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Withdraw";
  let lpToken = null;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "3", null);
}
