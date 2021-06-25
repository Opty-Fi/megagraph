import { BigInt, Address } from "@graphprotocol/graph-ts"

import {
  HarvestPoolData,
  RewardAdded,
  RewardDenied,
  RewardPaid,
  Staked,
  Withdrawn
} from "../../generated/HarvestPoolData/HarvestPoolData"
import {
  LastUpdateTime,
  RewardRate,
  RewardPerTokenStored
} from "../../generated/schema"

function HandleEntity(
  address: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let contract = HarvestPoolData.bind(address)
  let lastUpdateTime = new LastUpdateTime(txnHash)

  lastUpdateTime.lastUpdateTime = contract.lastUpdateTime()
  lastUpdateTime.blockNumber = blockNumber
  lastUpdateTime.timestamp = timestamp
  lastUpdateTime.vault = contract.lpToken().toString()
  lastUpdateTime.save()

  let rewardRate = new RewardRate(txnHash)

  rewardRate.rewardRate = contract.rewardRate()
  rewardRate.blockNumber = blockNumber
  rewardRate.timestamp = timestamp
  rewardRate.vault = contract.lpToken().toString()
  rewardRate.save()

  let rewardPerTokenStored = new RewardPerTokenStored(txnHash)

  rewardPerTokenStored.rewardPerTokenStored = contract.rewardPerTokenStored()
  rewardPerTokenStored.timestamp = blockNumber
  rewardPerTokenStored.blockNumber = timestamp
  rewardPerTokenStored.vault = contract.lpToken().toString()
  rewardPerTokenStored.save()
}

export function handleRewardAdded(event: RewardAdded): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleRewardDenied(event: RewardDenied): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleRewardPaid(event: RewardPaid): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleStaked(event: Staked): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleWithdrawn(event: Withdrawn): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}
