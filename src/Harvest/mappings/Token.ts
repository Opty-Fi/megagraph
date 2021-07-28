import {
  Deposit as DepositEvent,
  Invest as InvestEvent,
  StrategyChanged as StrategyChangedEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent
} from "../../../generated/HarvestTokenfDAI/HarvestToken";
import { handleEntity } from "./handlers";

export function handleDeposit(event: DepositEvent): void {
  handleEntity(
    null, // poolAddr
    event.address, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  );
}

export function handleInvest(event: InvestEvent): void {
  handleEntity(
    null, // poolAddr
    event.address, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  );
}

export function handleStrategyChanged(event: StrategyChangedEvent): void {
  handleEntity(
    null, // poolAddr
    event.address, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  );
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    null, // poolAddr
    event.address, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  );
}

export function handleWithdraw(event: WithdrawEvent): void {
  handleEntity(
    null, // poolAddr
    event.address, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  );
}
