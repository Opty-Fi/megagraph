import {
  DelegateChanged as DelegateChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RewardAdded as RewardAddedEvent,
  Staked as StakedEvent
} from "../generated/StakingProxy/StakingProxy"
import {
  StakingProxyDelegateChanged,
  StakingProxyOwnershipTransferred,
  StakingProxyRewardAdded,
  StakingProxyStaked
} from "../generated/schema"

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let entity = new StakingProxyDelegateChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.oldDelegate = event.params.oldDelegate
  entity.newDelegate = event.params.newDelegate
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new StakingProxyOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleRewardAdded(event: RewardAddedEvent): void {
  let entity = new StakingProxyRewardAdded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reward = event.params.reward
  entity.duration = event.params.duration
  entity.save()
}

export function handleStaked(event: StakedEvent): void {
  let entity = new StakingProxyStaked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.user = event.params.user
  entity.token = event.params.token
  entity.delegate = event.params.delegate
  entity.amount = event.params.amount
  entity.save()
}
