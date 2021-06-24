import {
  HarvestPoolData,
  RewardAdded,
  RewardDenied,
  RewardPaid,
  Staked,
  Withdrawn
} from "../generated/HarvestPoolData/HarvestPoolData"
import {
  LastUpdateTime,
  RewardRate,
  RewardPerTokenStored
} from "../generated/schema"

export function handleRewardAdded(event: RewardAdded): void {
  let contract = HarvestPoolData.bind(event.address)
  let lastUpdateTime = new LastUpdateTime(event.block.hash.toHex())

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.block = event.block.number
  lastUpdateTime.timestamp = event.block.timestamp
  lastUpdateTime.save()

  let rewardRate = new RewardRate(event.block.hash.toHex())

  rewardRate.rewardRate = contract.rewardRate()
  rewardRate.block = event.block.number
  rewardRate.timestamp = event.block.timestamp
  rewardRate.save()

  let rewardPerTokenStored = new RewardPerTokenStored(event.block.hash.toHex())

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = event.block.timestamp
  rewardPerTokenStored.block = event.block.number
  rewardPerTokenStored.save()
}

export function handleRewardDenied(event: RewardDenied): void {
  let contract = HarvestPoolData.bind(event.address)
  let lastUpdateTime = new LastUpdateTime(event.block.hash.toHex())

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.block = event.block.number
  lastUpdateTime.timestamp = event.block.timestamp
  lastUpdateTime.save()

  let rewardPerTokenStored = new RewardPerTokenStored(event.block.hash.toHex())

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = event.block.timestamp
  rewardPerTokenStored.block = event.block.number
  rewardPerTokenStored.save()
}

export function handleRewardPaid(event: RewardPaid): void {
  let contract = HarvestPoolData.bind(event.address)
  let lastUpdateTime = new LastUpdateTime(event.block.hash.toHex())

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.block = event.block.number
  lastUpdateTime.timestamp = event.block.timestamp
  lastUpdateTime.save()

  let rewardPerTokenStored = new RewardPerTokenStored(event.block.hash.toHex())

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = event.block.timestamp
  rewardPerTokenStored.block = event.block.number
  rewardPerTokenStored.save()
}

export function handleStaked(event: Staked): void {
  let contract = HarvestPoolData.bind(event.address)
  let lastUpdateTime = new LastUpdateTime(event.block.hash.toHex())

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.block = event.block.number
  lastUpdateTime.timestamp = event.block.timestamp
  lastUpdateTime.save()

  let rewardPerTokenStored = new RewardPerTokenStored(event.block.hash.toHex())

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = event.block.timestamp
  rewardPerTokenStored.block = event.block.number
  rewardPerTokenStored.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  let contract = HarvestPoolData.bind(event.address)
  let lastUpdateTime = new LastUpdateTime(event.block.hash.toHex())

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.block = event.block.number
  lastUpdateTime.timestamp = event.block.timestamp
  lastUpdateTime.save()

  let rewardPerTokenStored = new RewardPerTokenStored(event.block.hash.toHex())

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = event.block.timestamp
  rewardPerTokenStored.block = event.block.number
  rewardPerTokenStored.save()
}
