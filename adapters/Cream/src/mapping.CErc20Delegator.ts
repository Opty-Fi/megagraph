import { BigInt, log, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  CErc20Delegator,
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  NewReserveFactor as NewReserveFactorEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
  Transfer as TransferEvent
} from "./CErc20Delegator";
import { CreamToken } from "../generated/schema";
import { exponentToBigDecimal, convertBINumToDesiredDecimals } from "./converters";

function handleCreamToken(
  logIndex: BigInt,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  totalBorrows: BigInt,
  totalReserves: BigInt,
): void {
  let tokenContract = CErc20Delegator.bind(address);

  let entity = CreamToken.load(`${transactionHash.toHex()}-${logIndex.toString()}`);
  if (entity == null) {
    entity = new CreamToken(`${transactionHash.toHex()}-${blockNumber.toString()}`);
  }

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address.toHex();

  let symb = tokenContract.try_symbol();
  if (symb.reverted) log.error("symbol() reverted", []);
  else entity.symbol = symb.value;

  log.debug("Saving Cream Token {} of logIndex {} at address {} in block {} with txHash {}", [
    symb.value,
    logIndex.toString(),
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let tried_borrowRatePerBlock = tokenContract.try_borrowRatePerBlock();
  if (tried_borrowRatePerBlock.reverted) log.error("borrowRatePerBlock() reverted", []);
  else entity.borrowRatePerBlock = (
    convertBINumToDesiredDecimals(tried_borrowRatePerBlock.value, 18)
    .div(exponentToBigDecimal(18))
  );

  let tried_supplyRatePerBlock = tokenContract.try_supplyRatePerBlock();
  if (tried_supplyRatePerBlock.reverted) log.error("supplyRatePerBlock() reverted", []);
  else entity.supplyRatePerBlock = (
    convertBINumToDesiredDecimals(tried_supplyRatePerBlock.value, 18)
    .div(exponentToBigDecimal(18))
  );
  
  let tried_exchangeRateStored = tokenContract.try_exchangeRateStored();
  if (tried_exchangeRateStored.reverted) log.error("exchangeRateStored() reverted", []);
  else entity.exchangeRateStored = (
    convertBINumToDesiredDecimals(tried_exchangeRateStored.value, 10 + tokenContract.decimals())
    .div(exponentToBigDecimal(10 + tokenContract.decimals()))
  );

  let tried_getCash = tokenContract.try_getCash();
  if (tried_getCash.reverted) log.error("getCash() reverted", []);
  else entity.totalCash = (
    convertBINumToDesiredDecimals(tried_getCash.value, tokenContract.decimals())
    .div(exponentToBigDecimal(18))
  );

  let tried_totalSupply = tokenContract.try_totalSupply();
  if (tried_totalSupply.reverted) log.error("totalSupply() reverted", []);
  else entity.totalSupply = (
    convertBINumToDesiredDecimals(tried_totalSupply.value, tokenContract.decimals())
    .div(exponentToBigDecimal(18))
  );

  if (totalBorrows) {
    entity.totalBorrows = totalBorrows.toBigDecimal();
  } else {
    let tried_totalBorrows = tokenContract.try_totalBorrows();
    if (tried_totalBorrows.reverted) log.error("totalBorrows() reverted", []);
    else entity.totalBorrows = (
      convertBINumToDesiredDecimals(tried_totalBorrows.value, tokenContract.decimals())
      .div(exponentToBigDecimal(18))
    );
  }

  if (totalReserves) {
    entity.totalReserves = totalReserves.toBigDecimal();
  } else {
    let tried_totalReserves = tokenContract.try_totalReserves();
    if (tried_totalReserves.reverted) log.error("totalReserves() reverted", []);
    else entity.totalReserves = (
      convertBINumToDesiredDecimals(tried_totalReserves.value, tokenContract.decimals())
      .div(exponentToBigDecimal(18))
    );
  }
  
  entity.save();
}

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleBorrow(event: BorrowEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleMint(event: MintEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRedeem(event: RedeemEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}

export function handleTransfer(event: TransferEvent): void {
  handleCreamToken(
    event.logIndex,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // totalBorrows
    null, // totalReserves
  );
}
