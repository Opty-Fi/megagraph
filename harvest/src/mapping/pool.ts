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
  let lastUpdateTimeEntity = new LastUpdateTime(txnHash)
  let lastUpdateTime = contract.try_lastUpdateTime()
  if (lastUpdateTime.value) {
    lastUpdateTimeEntity.lastUpdateTime = lastUpdateTime.value
    lastUpdateTimeEntity.blockNumber = blockNumber
    lastUpdateTimeEntity.timestamp = timestamp
    lastUpdateTimeEntity.vault = contract.lpToken().toHexString()
    lastUpdateTimeEntity.save()
  }

  let rewardRateEntity = new RewardRate(txnHash)
  let rewardRate = contract.try_rewardRate()
  if (rewardRate.value) {
    rewardRateEntity.rewardRate = rewardRate.value
    rewardRateEntity.blockNumber = blockNumber
    rewardRateEntity.timestamp = timestamp
    rewardRateEntity.vault = contract.lpToken().toHexString()
    rewardRateEntity.save()
  }

  let rewardPerTokenStoredEntity = new RewardPerTokenStored(txnHash)
  let rewardPerTokenStored = contract.try_rewardPerTokenStored()
  if (rewardPerTokenStored.value) {
    rewardPerTokenStoredEntity.rewardPerTokenStored = rewardPerTokenStored.value
    rewardPerTokenStoredEntity.timestamp = blockNumber
    rewardPerTokenStoredEntity.blockNumber = timestamp
    rewardPerTokenStoredEntity.vault = contract.lpToken().toHexString()
    rewardPerTokenStoredEntity.save()
  }
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
