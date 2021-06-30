import {
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  NewReserveFactor as NewReserveFactorEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
  Transfer as TransferEvent,
} from '../../generated/CToken/CToken'
import { createCTokenEntity } from './helpers'

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    event.params.borrowIndex,
    event.params.totalBorrows
  )
}

export function handleBorrow(event: BorrowEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    event.params.totalBorrows
  )
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleMint(event: MintEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleRedeem(event: RedeemEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    event.params.totalBorrows
  )
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}

export function handleTransfer(event: TransferEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null,
    null,
    null
  )
}
