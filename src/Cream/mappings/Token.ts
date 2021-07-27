<<<<<<< HEAD
import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  CreamToken,
=======
import {
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
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
<<<<<<< HEAD
import { CreamTokenData } from "../../../generated/schema";
import { CreamComptrollerImplementation } from "../../../generated/CreamComptrollerImplementation/CreamComptrollerImplementation";
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
  
  let comptrollerContract: CreamComptrollerImplementation = null;
  let tried_comptroller = tokenContract.try_comptroller();
  if (!tried_comptroller.reverted) comptrollerContract = CreamComptrollerImplementation.bind(tried_comptroller.value);
  if (comptrollerContract) {
    let tried_compSpeeds = comptrollerContract.try_compSpeeds(address);
    if (tried_compSpeeds.reverted) log.error("compSpeeds() reverted", []);
    else entity.compSpeeds = convertBINumToDesiredDecimals(tried_compSpeeds.value, 18);
  }

  // @ts-ignore
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
  entity.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.symbol();

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
=======
import { handleEntity } from "./handlers";

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    event.params.borrowIndex,
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleBorrow(event: BorrowEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleFlashloan(event: FlashloanEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleMint(event: MintEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRedeem(event: RedeemEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
<<<<<<< HEAD
  handleCreamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
=======
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    null, // comptrollerAddr
    null, // newSpeed
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}
