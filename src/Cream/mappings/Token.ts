import {
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  Flashloan as FlashloanEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
} from "../../../generated/CreamTokencrDAI/CreamToken";
import { handleEntity } from "./handlers";

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    event.params.borrowIndex,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleBorrow(event: BorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleFlashloan(event: FlashloanEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleMint(event: MintEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}
