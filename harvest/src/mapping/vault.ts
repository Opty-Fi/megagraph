import {
  Deposit,
  Invest,
  StrategyChanged,
  Transfer,
  Withdraw
} from "../../generated/Vault/Vault"
import { handleEntity } from "../utils/helpers"

export function handleDeposit(event: Deposit): void {
  handleEntity(
    null,
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleInvest(event: Invest): void {
  handleEntity(
    null,
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleStrategyChanged(event: StrategyChanged): void {
  handleEntity(
    null,
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleTransfer(event: Transfer): void {
  handleEntity(
    null,
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleWithdraw(event: Withdraw): void {
  handleEntity(
    null,
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}
