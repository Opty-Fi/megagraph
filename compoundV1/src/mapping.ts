import { BigInt, log, Address, Bytes } from '@graphprotocol/graph-ts'
import {
  CToken,
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
} from '../generated/CToken/CToken'
import { CTokenData } from '../generated/schema'

//  Function to add/update the cToken Entity
function handleEntity(
  cTokenAddress: Address,
  transactionHash: Bytes,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let cTokenDataEntity = CTokenData.load(
    transactionHash.toHex() + '-' + blockNumber.toString(),
  )
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CTokenData(
      transactionHash.toHex() + '-' + blockNumber.toString(),
    )
  }
  let cTokenContract = CToken.bind(cTokenAddress)
  cTokenDataEntity.totalBorrows =
    totalBorrows == null
      ? cTokenContract.totalBorrows().toBigDecimal()
      : totalBorrows.toBigDecimal()
  cTokenDataEntity.blockNumber = blockNumber
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(blockTimestamp.toI32())

  cTokenDataEntity.cTokenAddress = cTokenAddress.toHexString()
  cTokenDataEntity.cTokenSymbol = cTokenContract.symbol()
  cTokenDataEntity.borrowIndex =
    borrowIndex == null
      ? cTokenContract.borrowIndex().toBigDecimal()
      : borrowIndex.toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract
    .exchangeRateStored()
    .toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()

  log.info('Logging Ctoken data into IPFS', [])
  cTokenDataEntity.save()
}

//  changing totalBorrows, borrowIndex, therefore capturing
export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.params.borrowIndex,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

//  Chaging totalBorrows, therefore capturing
export function handleBorrow(event: BorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

//  calling accureInterest() internally in contract therefore, capturing
export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  Change of totalSupply variable, therefore catching
export function handleMint(event: MintEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

// calling accureInterest internally, therefore capturing {May be it can be skipped as
// it is being captured by accureInterest event}
export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalSupply is getting changed
export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalBorrows getting changed, therefore capturing
export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalReserves getting changed, therefore capturing
export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalReserves getting changed
export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalSupply getting changed
export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}
