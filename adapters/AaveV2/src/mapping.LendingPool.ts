import {
  Borrow as BorrowEvent,
  Deposit as DepositEvent,
  FlashLoan as FlashLoanEvent,
  LiquidationCall as LiquidationCallEvent,
  Paused as PausedEvent,
  RebalanceStableBorrowRate as RebalanceStableBorrowRateEvent,
  Repay as RepayEvent,
  ReserveDataUpdated as ReserveDataUpdatedEvent,
  ReserveUsedAsCollateralDisabled as ReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as ReserveUsedAsCollateralEnabledEvent,
  Swap as SwapEvent,
  Unpaused as UnpausedEvent,
  Withdraw as WithdrawEvent
} from "../generated/LendingPool/LendingPool"
import {
  LendingPoolBorrow,
  LendingPoolDeposit,
  LendingPoolFlashLoan,
  LendingPoolLiquidationCall,
  LendingPoolPaused,
  LendingPoolRebalanceStableBorrowRate,
  LendingPoolRepay,
  LendingPoolReserveDataUpdated,
  LendingPoolReserveUsedAsCollateralDisabled,
  LendingPoolReserveUsedAsCollateralEnabled,
  LendingPoolSwap,
  LendingPoolUnpaused,
  LendingPoolWithdraw
} from "../generated/schema"

export function handleBorrow(event: BorrowEvent): void {
  let entity = new LendingPoolBorrow(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.onBehalfOf = event.params.onBehalfOf
  entity.amount = event.params.amount
  entity.borrowRateMode = event.params.borrowRateMode
  entity.borrowRate = event.params.borrowRate
  entity.referral = event.params.referral
  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new LendingPoolDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.onBehalfOf = event.params.onBehalfOf
  entity.amount = event.params.amount
  entity.referral = event.params.referral
  entity.save()
}

export function handleFlashLoan(event: FlashLoanEvent): void {
  let entity = new LendingPoolFlashLoan(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.target = event.params.target
  entity.initiator = event.params.initiator
  entity.asset = event.params.asset
  entity.amount = event.params.amount
  entity.premium = event.params.premium
  entity.referralCode = event.params.referralCode
  entity.save()
}

export function handleLiquidationCall(event: LiquidationCallEvent): void {
  let entity = new LendingPoolLiquidationCall(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.collateralAsset = event.params.collateralAsset
  entity.debtAsset = event.params.debtAsset
  entity.user = event.params.user
  entity.debtToCover = event.params.debtToCover
  entity.liquidatedCollateralAmount = event.params.liquidatedCollateralAmount
  entity.liquidator = event.params.liquidator
  entity.receiveAToken = event.params.receiveAToken
  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new LendingPoolPaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  entity.save()
}

export function handleRebalanceStableBorrowRate(
  event: RebalanceStableBorrowRateEvent
): void {
  let entity = new LendingPoolRebalanceStableBorrowRate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.save()
}

export function handleRepay(event: RepayEvent): void {
  let entity = new LendingPoolRepay(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.repayer = event.params.repayer
  entity.amount = event.params.amount
  entity.save()
}

export function handleReserveDataUpdated(event: ReserveDataUpdatedEvent): void {
  let entity = new LendingPoolReserveDataUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.liquidityRate = event.params.liquidityRate
  entity.stableBorrowRate = event.params.stableBorrowRate
  entity.variableBorrowRate = event.params.variableBorrowRate
  entity.liquidityIndex = event.params.liquidityIndex
  entity.variableBorrowIndex = event.params.variableBorrowIndex
  entity.save()
}

export function handleReserveUsedAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabledEvent
): void {
  let entity = new LendingPoolReserveUsedAsCollateralDisabled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.save()
}

export function handleReserveUsedAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabledEvent
): void {
  let entity = new LendingPoolReserveUsedAsCollateralEnabled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.save()
}

export function handleSwap(event: SwapEvent): void {
  let entity = new LendingPoolSwap(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.rateMode = event.params.rateMode
  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new LendingPoolUnpaused(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new LendingPoolWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.user = event.params.user
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}
