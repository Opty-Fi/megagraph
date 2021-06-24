import {
  Borrow as BorrowEvent,
  Deposit as DepositEvent,
  FlashLoan as FlashLoanEvent,
  LiquidationCall as LiquidationCallEvent,
  OriginationFeeLiquidated as OriginationFeeLiquidatedEvent,
  RebalanceStableBorrowRate as RebalanceStableBorrowRateEvent,
  RedeemUnderlying as RedeemUnderlyingEvent,
  Repay as RepayEvent,
  ReserveUsedAsCollateralDisabled as ReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as ReserveUsedAsCollateralEnabledEvent,
  Swap as SwapEvent
} from "../generated/LendingPool/LendingPool"
import {
  LendingPoolBorrow,
  LendingPoolDeposit,
  LendingPoolFlashLoan,
  LendingPoolLiquidationCall,
  LendingPoolOriginationFeeLiquidated,
  LendingPoolRebalanceStableBorrowRate,
  LendingPoolRedeemUnderlying,
  LendingPoolRepay,
  LendingPoolReserveUsedAsCollateralDisabled,
  LendingPoolReserveUsedAsCollateralEnabled,
  LendingPoolSwap
} from "../generated/schema"

export function handleBorrow(event: BorrowEvent): void {
  let entity = new LendingPoolBorrow(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._amount = event.params._amount
  entity._borrowRateMode = event.params._borrowRateMode
  entity._borrowRate = event.params._borrowRate
  entity._originationFee = event.params._originationFee
  entity._borrowBalanceIncrease = event.params._borrowBalanceIncrease
  entity._referral = event.params._referral
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new LendingPoolDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._amount = event.params._amount
  entity._referral = event.params._referral
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleFlashLoan(event: FlashLoanEvent): void {
  let entity = new LendingPoolFlashLoan(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._target = event.params._target
  entity._reserve = event.params._reserve
  entity._amount = event.params._amount
  entity._totalFee = event.params._totalFee
  entity._protocolFee = event.params._protocolFee
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleLiquidationCall(event: LiquidationCallEvent): void {
  let entity = new LendingPoolLiquidationCall(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._collateral = event.params._collateral
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._purchaseAmount = event.params._purchaseAmount
  entity._liquidatedCollateralAmount = event.params._liquidatedCollateralAmount
  entity._accruedBorrowInterest = event.params._accruedBorrowInterest
  entity._liquidator = event.params._liquidator
  entity._receiveAToken = event.params._receiveAToken
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleOriginationFeeLiquidated(
  event: OriginationFeeLiquidatedEvent
): void {
  let entity = new LendingPoolOriginationFeeLiquidated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._collateral = event.params._collateral
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._feeLiquidated = event.params._feeLiquidated
  entity._liquidatedCollateralForFee = event.params._liquidatedCollateralForFee
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleRebalanceStableBorrowRate(
  event: RebalanceStableBorrowRateEvent
): void {
  let entity = new LendingPoolRebalanceStableBorrowRate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._newStableRate = event.params._newStableRate
  entity._borrowBalanceIncrease = event.params._borrowBalanceIncrease
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleRedeemUnderlying(event: RedeemUnderlyingEvent): void {
  let entity = new LendingPoolRedeemUnderlying(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._amount = event.params._amount
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleRepay(event: RepayEvent): void {
  let entity = new LendingPoolRepay(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._repayer = event.params._repayer
  entity._amountMinusFees = event.params._amountMinusFees
  entity._fees = event.params._fees
  entity._borrowBalanceIncrease = event.params._borrowBalanceIncrease
  entity._timestamp = event.params._timestamp
  entity.save()
}

export function handleReserveUsedAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabledEvent
): void {
  let entity = new LendingPoolReserveUsedAsCollateralDisabled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity.save()
}

export function handleReserveUsedAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabledEvent
): void {
  let entity = new LendingPoolReserveUsedAsCollateralEnabled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity.save()
}

export function handleSwap(event: SwapEvent): void {
  let entity = new LendingPoolSwap(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._reserve = event.params._reserve
  entity._user = event.params._user
  entity._newRateMode = event.params._newRateMode
  entity._newRate = event.params._newRate
  entity._borrowBalanceIncrease = event.params._borrowBalanceIncrease
  entity._timestamp = event.params._timestamp
  entity.save()
}
