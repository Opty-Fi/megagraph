import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  JoeMasterChefJoeV3 as MasterChefJoeV3Contract,
  OwnershipTransferred as OwnershipTransferredEvent,
  Withdraw as WithdrawEvent,
} from "../../../generated/JoeMasterChefJoeV3/JoeMasterChefJoeV3";

export function handleAdd(event: AddEvent): void {}
export function handleSet(event: SetEvent): void {}
export function handleDeposit(event: DepositEvent): void {}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {}
export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {}
export function handleWithdraw(event: WithdrawEvent): void {}
