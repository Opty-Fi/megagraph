import { BigInt, log, Bytes, BigDecimal } from "@graphprotocol/graph-ts"
import {
  AccrueInterest as AccrueInterestEvent,
  Approval as ApprovalEvent,
  Borrow as BorrowEvent,
  CToken,
  Failure as FailureEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  NewAdmin as NewAdminEvent,
  NewComptroller as NewComptrollerEvent,
  NewImplementation as NewImplementationEvent,
  NewMarketInterestRateModel as NewMarketInterestRateModelEvent,
  NewPendingAdmin as NewPendingAdminEvent,
  NewReserveFactor as NewReserveFactorEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
  Transfer as TransferEvent
} from "../generated/CToken/CToken"
import {
  AccrueInterest,
  Approval,
  Borrow,
  CTokenData,
  Failure,
  LiquidateBorrow,
  Mint,
  NewAdmin,
  NewComptroller,
  NewImplementation,
  NewMarketInterestRateModel,
  NewPendingAdmin,
  NewReserveFactor,
  Redeem,
  RepayBorrow,
  ReservesAdded,
  ReservesReduced,
  Transfer
} from "../generated/schema"

//  changing totalBorrows, borrowIndex, therefore capturing
export function handleAccrueInterest(event: AccrueInterestEvent): void {
  let entity = new AccrueInterest(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.cashPrior = event.params.cashPrior
  entity.interestAccumulated = event.params.interestAccumulated
  entity.borrowIndex = event.params.borrowIndex
  entity.totalBorrows = event.params.totalBorrows
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  // cTokenDataEntity.totalCash = event.params.cashPrior
  // cTokenDataEntity.interestAccumulated = event.params.interestAccumulated
  cTokenDataEntity.borrowIndex = event.params.borrowIndex.toBigDecimal()
  cTokenDataEntity.totalBorrows = event.params.totalBorrows.toBigDecimal()
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  
  log.info("Logging Ctoken data into IPFS", [])
  // cTokenDataEntity.exchangeRate = 
  cTokenDataEntity.save()
}

//  Not required
export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

//  Chaging totalBorrows, therefore capturing
export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.borrower = event.params.borrower
  entity.borrowAmount = event.params.borrowAmount
  entity.accountBorrows = event.params.accountBorrows
  entity.totalBorrows = event.params.totalBorrows
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.totalBorrows = event.params.totalBorrows.toBigDecimal()
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  Not needed
export function handleFailure(event: FailureEvent): void {
  let entity = new Failure(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.error = event.params.error
  entity.info = event.params.info
  entity.detail = event.params.detail
  entity.save()
}

//  calling accureInterest() internally in contract therefore, capturing
export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  let entity = new LiquidateBorrow(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.liquidator = event.params.liquidator
  entity.borrower = event.params.borrower
  entity.repayAmount = event.params.repayAmount
  entity.cTokenCollateral = event.params.cTokenCollateral
  entity.seizeTokens = event.params.seizeTokens
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  Change of totalSupply variable, therefore catching
export function handleMint(event: MintEvent): void {
  let entity = new Mint(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.minter = event.params.minter
  entity.mintAmount = event.params.mintAmount
  entity.mintTokens = event.params.mintTokens
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  Not required
export function handleNewAdmin(event: NewAdminEvent): void {
  let entity = new NewAdmin(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldAdmin = event.params.oldAdmin
  entity.newAdmin = event.params.newAdmin
  entity.save()
}

//  Not required
export function handleNewComptroller(event: NewComptrollerEvent): void {
  let entity = new NewComptroller(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldComptroller = event.params.oldComptroller
  entity.newComptroller = event.params.newComptroller
  entity.save()
}

//  Not required
export function handleNewImplementation(event: NewImplementationEvent): void {
  let entity = new NewImplementation(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldImplementation = event.params.oldImplementation
  entity.newImplementation = event.params.newImplementation
  entity.save()
}

//  Not required
export function handleNewMarketInterestRateModel(
  event: NewMarketInterestRateModelEvent
): void {
  let entity = new NewMarketInterestRateModel(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldInterestRateModel = event.params.oldInterestRateModel
  entity.newInterestRateModel = event.params.newInterestRateModel
  entity.save()
}

//  Not required
export function handleNewPendingAdmin(event: NewPendingAdminEvent): void {
  let entity = new NewPendingAdmin(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldPendingAdmin = event.params.oldPendingAdmin
  entity.newPendingAdmin = event.params.newPendingAdmin
  entity.save()
}

// calling accureInterest internally, therefore capturing {May be it can be skipped as
// it is being captured by accureInterest event}
export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  let entity = new NewReserveFactor(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.oldReserveFactorMantissa = event.params.oldReserveFactorMantissa
  entity.newReserveFactorMantissa = event.params.newReserveFactorMantissa
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  totalSupply is getting changed
export function handleRedeem(event: RedeemEvent): void {
  let entity = new Redeem(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.redeemer = event.params.redeemer
  entity.redeemAmount = event.params.redeemAmount
  entity.redeemTokens = event.params.redeemTokens
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  totalBorrows getting changed, therefore capturing
export function handleRepayBorrow(event: RepayBorrowEvent): void {
  let entity = new RepayBorrow(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.payer = event.params.payer
  entity.borrower = event.params.borrower
  entity.repayAmount = event.params.repayAmount
  entity.accountBorrows = event.params.accountBorrows
  entity.totalBorrows = event.params.totalBorrows
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  totalReserves getting changed, therefore capturing
export function handleReservesAdded(event: ReservesAddedEvent): void {
  let entity = new ReservesAdded(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.benefactor = event.params.benefactor
  entity.addAmount = event.params.addAmount
  entity.newTotalReserves = event.params.newTotalReserves
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  totalReserves getting changed
export function handleReservesReduced(event: ReservesReducedEvent): void {
  let entity = new ReservesReduced(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.admin = event.params.admin
  entity.reduceAmount = event.params.reduceAmount
  entity.newTotalReserves = event.params.newTotalReserves
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}

//  totalSupply getting changed
export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.block.number.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()

  let cTokenDataEntity = CTokenData.load(event.transaction.hash.toHex() + "-" + event.block.number.toString())
  if (cTokenDataEntity == null) {
    cTokenDataEntity =  new CTokenData(
      event.transaction.hash.toHex() + "-" + event.block.number.toString()
    )
  }
  cTokenDataEntity.blockNumber = event.block.number
  cTokenDataEntity.blockTimestamp = BigInt.fromI32(event.block.timestamp.toI32())
  
  let cTokenContract = CToken.bind(event.address)
  cTokenDataEntity.totalBorrows = cTokenContract.totalBorrows().toBigDecimal()
  cTokenDataEntity.borrowIndex = cTokenContract.borrowIndex().toBigDecimal()
  cTokenDataEntity.totalCash = cTokenContract.getCash().toBigDecimal()
  cTokenDataEntity.exchangeRate = cTokenContract.exchangeRateStored().toBigDecimal()
  cTokenDataEntity.borrowRatePerBlock = cTokenContract.borrowRatePerBlock()
  cTokenDataEntity.totalReserves = cTokenContract.totalReserves().toBigDecimal()
  cTokenDataEntity.totalSupply = cTokenContract.totalSupply().toBigDecimal()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.supplyRatePerBlock()
  log.info("Logging Ctoken data into IPFS", [])
  cTokenDataEntity.save()
}
