import { Address } from "@graphprotocol/graph-ts";
import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  Withdraw as WithdrawEvent,
} from "../../../generated/TraderJoeMasterChefJoeV3/TraderJoeMasterChefJoeV3";
import { handlePoolEvent } from "./handleFarmEntity";

export function handleAdd(event: AddEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Add";
  let lpToken: Address = event.params.lpToken;
  handlePoolEvent(txnHash, blockNumber, timestamp, poolId, eventType, "V3", lpToken);
}
export function handleSet(event: SetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Set";

  handlePoolEvent(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
export function handleDeposit(event: DepositEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Deposit";

  handlePoolEvent(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "EmergencyWithdraw";

  handlePoolEvent(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Withdraw";

  handlePoolEvent(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
