import { BigInt, Address } from "@graphprotocol/graph-ts"

import {
  HarvestPoolData as HarvestPoolDataEntity,
  RewardAdded,
  RewardDenied,
  RewardPaid,
  Staked,
  Withdrawn
} from "../../generated/HarvestPoolData/HarvestPoolData"
import { HarvestPoolData } from "../../generated/schema"

function HandleEntity(
  address: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let contract = HarvestPoolDataEntity.bind(address)
  let harvestPoolData = HarvestPoolData.load(txnHash)
  if (harvestPoolData == null) {
    harvestPoolData = new HarvestPoolData(txnHash)
  }
  harvestPoolData.blockNumber = blockNumber
  harvestPoolData.timestamp = timestamp
  harvestPoolData.vault = contract.lpToken().toHexString()

  let lastUpdateTime = contract.try_lastUpdateTime()
  let rewardRate = contract.try_rewardRate()
  let rewardPerTokenStored = contract.try_rewardPerTokenStored()

  harvestPoolData.lastUpdateTime = !lastUpdateTime.reverted
    ? lastUpdateTime.value
    : BigInt.fromI32(0)
  harvestPoolData.rewardRate = !rewardRate.reverted
    ? rewardRate.value
    : BigInt.fromI32(0)
  harvestPoolData.rewardPerTokenStored = !rewardPerTokenStored.reverted
    ? rewardPerTokenStored.value
    : BigInt.fromI32(0)

  harvestPoolData.save()
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
