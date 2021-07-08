import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  CreamToken,
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  Flashloan as FlashloanEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
} from "../../../generated/CreamToken/CreamToken";
import { CreamTokenData } from "../../../generated/schema";
import { ComptrollerImplementation } from "../../../generated/ComptrollerImplementation/ComptrollerImplementation";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

function handleCreamToken(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
  totalReserves: BigInt,
): void {
  let tokenContract = CreamToken.bind(address);

  let entity = CreamTokenData.load(transactionHash.toHex());
  if (!entity) entity = new CreamTokenData(transactionHash.toHex());
  
  let comptrollerContract: ComptrollerImplementation = null;
  let tried_comptroller = tokenContract.try_comptroller();
  if (!tried_comptroller.reverted) comptrollerContract = ComptrollerImplementation.bind(tried_comptroller.value);
  if (comptrollerContract) {
    let tried_compSpeeds = comptrollerContract.try_compSpeeds(address);
    if (tried_compSpeeds.reverted) log.error("compSpeeds() reverted", []);
    else entity.compSpeeds = convertBINumToDesiredDecimals(tried_compSpeeds.value, 18);
  }

  let underlyingAssetDecimals: i32;
  let underlyingAsset = tokenContract.try_underlying();
  if (underlyingAsset.reverted) log.error("underlying() reverted", []);
  else {
    let underlyingAssetContract = CreamToken.bind(underlyingAsset.value);
    if (!underlyingAssetContract) log.error("No underlyingAsset at {}", [ underlyingAsset.value.toHex() ]);
    else {
      let tried_underlyingAssetDecimals = underlyingAssetContract.try_decimals();
      if (tried_underlyingAssetDecimals.reverted) log.error("decimals() reverted", []);
      else underlyingAssetDecimals = tried_underlyingAssetDecimals.value;
    }
  }

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;
  entity.symbol = tokenContract.symbol();

  log.debug("Saving Cream Token {} at address {} in block {} with txHash {}", [
    entity.symbol,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  if (borrowIndex) {
    entity.borrowIndex = borrowIndex;
  } else {
    let tried_borrowIndex = tokenContract.try_borrowIndex();
    if (tried_borrowIndex.reverted) log.error("borrowIndex() reverted", []);
    else entity.borrowIndex = tried_borrowIndex.value;
  }

  let tried_borrowRatePerBlock = tokenContract.try_borrowRatePerBlock();
  if (tried_borrowRatePerBlock.reverted) log.error("borrowRatePerBlock() reverted", []);
  else entity.borrowRatePerBlock = convertBINumToDesiredDecimals(tried_borrowRatePerBlock.value, 18);

  let tried_supplyRatePerBlock = tokenContract.try_supplyRatePerBlock();
  if (tried_supplyRatePerBlock.reverted) log.error("supplyRatePerBlock() reverted", []);
  else entity.supplyRatePerBlock = convertBINumToDesiredDecimals(tried_supplyRatePerBlock.value, 18);
  
  let tried_exchangeRateStored = tokenContract.try_exchangeRateStored();
  if (tried_exchangeRateStored.reverted) log.error("exchangeRateStored() reverted", []);
  else entity.exchangeRateStored = convertBINumToDesiredDecimals(tried_exchangeRateStored.value, 10 + underlyingAssetDecimals);

  let tried_getCash = tokenContract.try_getCash();
  if (tried_getCash.reverted) log.error("getCash() reverted", []);
  else entity.totalCash = convertBINumToDesiredDecimals(tried_getCash.value, underlyingAssetDecimals);

  if (totalBorrows) {
    entity.totalBorrows = totalBorrows.toBigDecimal();
  } else {
    let tried_totalBorrows = tokenContract.try_totalBorrows();
    if (tried_totalBorrows.reverted) log.error("totalBorrows() reverted", []);
    else entity.totalBorrows = convertBINumToDesiredDecimals(tried_totalBorrows.value, underlyingAssetDecimals);
  }

  let tried_totalSupply = tokenContract.try_totalSupply();
  if (tried_totalSupply.reverted) log.error("totalSupply() reverted", []);
  else entity.totalSupply = convertBINumToDesiredDecimals(tried_totalSupply.value, underlyingAssetDecimals);

  if (totalReserves) {
    entity.totalReserves = totalReserves.toBigDecimal();
  } else {
    let tried_totalReserves = tokenContract.try_totalReserves();
    if (tried_totalReserves.reverted) log.error("totalReserves() reverted", []);
    else entity.totalReserves = convertBINumToDesiredDecimals(tried_totalReserves.value, underlyingAssetDecimals);
  }
  
  entity.save();
}

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.borrowIndex,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleBorrow(event: BorrowEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleFlashloan(event: FlashloanEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleMint(event: MintEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRedeem(event: RedeemEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}
