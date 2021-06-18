import {
  Approval as ApprovalEvent,
  BalanceTransfer as BalanceTransferEvent,
  BurnOnLiquidation as BurnOnLiquidationEvent,
  InterestRedirectionAllowanceChanged as InterestRedirectionAllowanceChangedEvent,
  InterestStreamRedirected as InterestStreamRedirectedEvent,
  MintOnDeposit as MintOnDepositEvent,
  Redeem as RedeemEvent,
  RedirectedBalanceUpdated as RedirectedBalanceUpdatedEvent,
  Transfer as TransferEvent
} from "../generated/AaveV1Aaave/AaveV1Aaave"
import {
  Approval,
  BalanceTransfer,
  BurnOnLiquidation,
  InterestRedirectionAllowanceChanged,
  InterestStreamRedirected,
  MintOnDeposit,
  Redeem,
  RedirectedBalanceUpdated,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleBalanceTransfer(event: BalanceTransferEvent): void {
  let entity = new BalanceTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._to = event.params._to
  entity._value = event.params._value
  entity._fromBalanceIncrease = event.params._fromBalanceIncrease
  entity._toBalanceIncrease = event.params._toBalanceIncrease
  entity._fromIndex = event.params._fromIndex
  entity._toIndex = event.params._toIndex
  entity.save()
}

export function handleBurnOnLiquidation(event: BurnOnLiquidationEvent): void {
  let entity = new BurnOnLiquidation(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._value = event.params._value
  entity._fromBalanceIncrease = event.params._fromBalanceIncrease
  entity._fromIndex = event.params._fromIndex
  entity.save()
}

export function handleInterestRedirectionAllowanceChanged(
  event: InterestRedirectionAllowanceChangedEvent
): void {
  let entity = new InterestRedirectionAllowanceChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._to = event.params._to
  entity.save()
}

export function handleInterestStreamRedirected(
  event: InterestStreamRedirectedEvent
): void {
  let entity = new InterestStreamRedirected(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._to = event.params._to
  entity._redirectedBalance = event.params._redirectedBalance
  entity._fromBalanceIncrease = event.params._fromBalanceIncrease
  entity._fromIndex = event.params._fromIndex
  entity.save()
}

export function handleMintOnDeposit(event: MintOnDepositEvent): void {
  let entity = new MintOnDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._value = event.params._value
  entity._fromBalanceIncrease = event.params._fromBalanceIncrease
  entity._fromIndex = event.params._fromIndex
  entity.save()
}

export function handleRedeem(event: RedeemEvent): void {
  let entity = new Redeem(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._from = event.params._from
  entity._value = event.params._value
  entity._fromBalanceIncrease = event.params._fromBalanceIncrease
  entity._fromIndex = event.params._fromIndex
  entity.save()
}

export function handleRedirectedBalanceUpdated(
  event: RedirectedBalanceUpdatedEvent
): void {
  let entity = new RedirectedBalanceUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._targetAddress = event.params._targetAddress
  entity._targetBalanceIncrease = event.params._targetBalanceIncrease
  entity._targetIndex = event.params._targetIndex
  entity._redirectedBalanceAdded = event.params._redirectedBalanceAdded
  entity._redirectedBalanceRemoved = event.params._redirectedBalanceRemoved
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}
