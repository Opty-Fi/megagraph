import {
  AccrueInterest as AccrueInterestEvent,
  Approval as ApprovalEvent,
  Borrow as BorrowEvent,
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
} from "../generated/CreamBbtc/CreamBbtc"
import {
  AccrueInterest,
  Approval,
  Borrow,
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

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  let entity = new AccrueInterest(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.cashPrior = event.params.cashPrior
  entity.interestAccumulated = event.params.interestAccumulated
  entity.borrowIndex = event.params.borrowIndex
  entity.totalBorrows = event.params.totalBorrows
  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.borrower = event.params.borrower
  entity.borrowAmount = event.params.borrowAmount
  entity.accountBorrows = event.params.accountBorrows
  entity.totalBorrows = event.params.totalBorrows
  entity.save()
}

export function handleFailure(event: FailureEvent): void {
  let entity = new Failure(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.error = event.params.error
  entity.info = event.params.info
  entity.detail = event.params.detail
  entity.save()
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  let entity = new LiquidateBorrow(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.liquidator = event.params.liquidator
  entity.borrower = event.params.borrower
  entity.repayAmount = event.params.repayAmount
  entity.cTokenCollateral = event.params.cTokenCollateral
  entity.seizeTokens = event.params.seizeTokens
  entity.save()
}

export function handleMint(event: MintEvent): void {
  let entity = new Mint(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.minter = event.params.minter
  entity.mintAmount = event.params.mintAmount
  entity.mintTokens = event.params.mintTokens
  entity.save()
}

export function handleNewAdmin(event: NewAdminEvent): void {
  let entity = new NewAdmin(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldAdmin = event.params.oldAdmin
  entity.newAdmin = event.params.newAdmin
  entity.save()
}

export function handleNewComptroller(event: NewComptrollerEvent): void {
  let entity = new NewComptroller(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldComptroller = event.params.oldComptroller
  entity.newComptroller = event.params.newComptroller
  entity.save()
}

export function handleNewImplementation(event: NewImplementationEvent): void {
  let entity = new NewImplementation(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldImplementation = event.params.oldImplementation
  entity.newImplementation = event.params.newImplementation
  entity.save()
}

export function handleNewMarketInterestRateModel(
  event: NewMarketInterestRateModelEvent
): void {
  let entity = new NewMarketInterestRateModel(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldInterestRateModel = event.params.oldInterestRateModel
  entity.newInterestRateModel = event.params.newInterestRateModel
  entity.save()
}

export function handleNewPendingAdmin(event: NewPendingAdminEvent): void {
  let entity = new NewPendingAdmin(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldPendingAdmin = event.params.oldPendingAdmin
  entity.newPendingAdmin = event.params.newPendingAdmin
  entity.save()
}

export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  let entity = new NewReserveFactor(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.oldReserveFactorMantissa = event.params.oldReserveFactorMantissa
  entity.newReserveFactorMantissa = event.params.newReserveFactorMantissa
  entity.save()
}

export function handleRedeem(event: RedeemEvent): void {
  let entity = new Redeem(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.redeemer = event.params.redeemer
  entity.redeemAmount = event.params.redeemAmount
  entity.redeemTokens = event.params.redeemTokens
  entity.save()
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  let entity = new RepayBorrow(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.payer = event.params.payer
  entity.borrower = event.params.borrower
  entity.repayAmount = event.params.repayAmount
  entity.accountBorrows = event.params.accountBorrows
  entity.totalBorrows = event.params.totalBorrows
  entity.save()
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  let entity = new ReservesAdded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.benefactor = event.params.benefactor
  entity.addAmount = event.params.addAmount
  entity.newTotalReserves = event.params.newTotalReserves
  entity.save()
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  let entity = new ReservesReduced(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.admin = event.params.admin
  entity.reduceAmount = event.params.reduceAmount
  entity.newTotalReserves = event.params.newTotalReserves
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}
