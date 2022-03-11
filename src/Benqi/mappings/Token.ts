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
} from "../../../generated/BenqiTokenqiAVAX/BenqiToken";
import { handleEntity } from "./handlers";

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    event.params.borrowIndex,
    event.params.totalBorrows,
  );
}

export function handleBorrow(event: BorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    event.params.totalBorrows,
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleMint(event: MintEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    event.params.totalBorrows,
  );
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // qiTokenAddress
    null, // borrowIndex
    null, // totalBorrows
  );
}
