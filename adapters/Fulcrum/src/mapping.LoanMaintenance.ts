import {
  ClaimReward as ClaimRewardEvent,
  DepositCollateral as DepositCollateralEvent,
  EarnReward as EarnRewardEvent,
  ExtendLoanDuration as ExtendLoanDurationEvent,
  ExternalSwap as ExternalSwapEvent,
  LoanDeposit as LoanDepositEvent,
  LoanSwap as LoanSwapEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PayBorrowingFee as PayBorrowingFeeEvent,
  PayLendingFee as PayLendingFeeEvent,
  PayTradingFee as PayTradingFeeEvent,
  ReduceLoanDuration as ReduceLoanDurationEvent,
  SettleFeeRewardForInterestExpense as SettleFeeRewardForInterestExpenseEvent,
  VaultDeposit as VaultDepositEvent,
  VaultWithdraw as VaultWithdrawEvent,
  WithdrawCollateral as WithdrawCollateralEvent
} from "../generated/LoanMaintenance/LoanMaintenance"
import {
  LoanMaintenanceClaimReward,
  LoanMaintenanceDepositCollateral,
  LoanMaintenanceEarnReward,
  LoanMaintenanceExtendLoanDuration,
  LoanMaintenanceExternalSwap,
  LoanMaintenanceLoanDeposit,
  LoanMaintenanceLoanSwap,
  LoanMaintenanceOwnershipTransferred,
  LoanMaintenancePayBorrowingFee,
  LoanMaintenancePayLendingFee,
  LoanMaintenancePayTradingFee,
  LoanMaintenanceReduceLoanDuration,
  LoanMaintenanceSettleFeeRewardForInterestExpense,
  LoanMaintenanceVaultDeposit,
  LoanMaintenanceVaultWithdraw,
  LoanMaintenanceWithdrawCollateral
} from "../generated/schema"

export function handleClaimReward(event: ClaimRewardEvent): void {
  let entity = new LoanMaintenanceClaimReward(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.receiver = event.params.receiver
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.save()
}

export function handleDepositCollateral(event: DepositCollateralEvent): void {
  let entity = new LoanMaintenanceDepositCollateral(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.depositToken = event.params.depositToken
  entity.loanId = event.params.loanId
  entity.depositAmount = event.params.depositAmount
  entity.save()
}

export function handleEarnReward(event: EarnRewardEvent): void {
  let entity = new LoanMaintenanceEarnReward(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.receiver = event.params.receiver
  entity.loanId = event.params.loanId
  entity.feeType = event.params.feeType
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.save()
}

export function handleExtendLoanDuration(event: ExtendLoanDurationEvent): void {
  let entity = new LoanMaintenanceExtendLoanDuration(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.depositToken = event.params.depositToken
  entity.loanId = event.params.loanId
  entity.depositAmount = event.params.depositAmount
  entity.collateralUsedAmount = event.params.collateralUsedAmount
  entity.newEndTimestamp = event.params.newEndTimestamp
  entity.save()
}

export function handleExternalSwap(event: ExternalSwapEvent): void {
  let entity = new LoanMaintenanceExternalSwap(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.sourceToken = event.params.sourceToken
  entity.destToken = event.params.destToken
  entity.sourceAmount = event.params.sourceAmount
  entity.destAmount = event.params.destAmount
  entity.save()
}

export function handleLoanDeposit(event: LoanDepositEvent): void {
  let entity = new LoanMaintenanceLoanDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.loanId = event.params.loanId
  entity.depositValueAsLoanToken = event.params.depositValueAsLoanToken
  entity.depositValueAsCollateralToken =
    event.params.depositValueAsCollateralToken
  entity.save()
}

export function handleLoanSwap(event: LoanSwapEvent): void {
  let entity = new LoanMaintenanceLoanSwap(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.loanId = event.params.loanId
  entity.sourceToken = event.params.sourceToken
  entity.destToken = event.params.destToken
  entity.borrower = event.params.borrower
  entity.sourceAmount = event.params.sourceAmount
  entity.destAmount = event.params.destAmount
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new LoanMaintenanceOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handlePayBorrowingFee(event: PayBorrowingFeeEvent): void {
  let entity = new LoanMaintenancePayBorrowingFee(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.payer = event.params.payer
  entity.token = event.params.token
  entity.loanId = event.params.loanId
  entity.amount = event.params.amount
  entity.save()
}

export function handlePayLendingFee(event: PayLendingFeeEvent): void {
  let entity = new LoanMaintenancePayLendingFee(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.payer = event.params.payer
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.save()
}

export function handlePayTradingFee(event: PayTradingFeeEvent): void {
  let entity = new LoanMaintenancePayTradingFee(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.payer = event.params.payer
  entity.token = event.params.token
  entity.loanId = event.params.loanId
  entity.amount = event.params.amount
  entity.save()
}

export function handleReduceLoanDuration(event: ReduceLoanDurationEvent): void {
  let entity = new LoanMaintenanceReduceLoanDuration(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.withdrawToken = event.params.withdrawToken
  entity.loanId = event.params.loanId
  entity.withdrawAmount = event.params.withdrawAmount
  entity.newEndTimestamp = event.params.newEndTimestamp
  entity.save()
}

export function handleSettleFeeRewardForInterestExpense(
  event: SettleFeeRewardForInterestExpenseEvent
): void {
  let entity = new LoanMaintenanceSettleFeeRewardForInterestExpense(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.payer = event.params.payer
  entity.token = event.params.token
  entity.loanId = event.params.loanId
  entity.amount = event.params.amount
  entity.save()
}

export function handleVaultDeposit(event: VaultDepositEvent): void {
  let entity = new LoanMaintenanceVaultDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.asset = event.params.asset
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.save()
}

export function handleVaultWithdraw(event: VaultWithdrawEvent): void {
  let entity = new LoanMaintenanceVaultWithdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.asset = event.params.asset
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.save()
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  let entity = new LoanMaintenanceWithdrawCollateral(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.withdrawToken = event.params.withdrawToken
  entity.loanId = event.params.loanId
  entity.withdrawAmount = event.params.withdrawAmount
  entity.save()
}
