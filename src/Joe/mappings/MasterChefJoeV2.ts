import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  JoeMasterChefJoeV2 as MasterChefJoeV2Contract,
  Withdraw as WithdrawEvent,
  JoeMasterChefJoeV2,
} from "../../../generated/JoeMasterChefJoeV2/JoeMasterChefJoeV2";
import { JoeMasterChefV2Address } from "../../utils/constants";
import { handlePool } from "./handlerFarm";

export function handleAdd(event: AddEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let lpToken: Address = event.params.lpToken;
  let eventType = "Add";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "2", lpToken);
}
export function handleSet(event: SetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;

  let eventType = "Set";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "2", null);
}
export function handleDeposit(event: DepositEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let lpToken = null;
  let eventType = "Deposit";
  let contract = JoeMasterChefJoeV2.bind(JoeMasterChefV2Address);
  contract.handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "2", null);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "EmergencyWithdraw";
  let lpToken = null;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "2", null);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Withdraw";
  let lpToken = null;

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "2", null);
}
