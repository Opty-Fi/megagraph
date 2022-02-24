import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  JoeMasterChefJoeV2 as MasterChefJoeV2Contract,
  OwnershipTransferred as OwnershipTransferredEvent,
  UpdateEmissionRate as UpdateEmissionRateEvent,
  Withdraw as WithdrawEvent,
} from "../../../generated/JoeMasterChefJoeV2/JoeMasterChefJoeV2";

export function handleAdd(event: AddEvent): void {}
export function handleSet(event: SetEvent): void {}
export function handleDeposit(event: DepositEvent): void {}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {}
export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {}
export function handleUpdateEmissionRate(event: UpdateEmissionRateEvent): void {}
export function handleWithdraw(event: WithdrawEvent): void {}
