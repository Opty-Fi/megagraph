import {
  HarvestPoolData as HarvestPoolDataEntity,
  RewardAdded,
  RewardDenied,
  RewardPaid,
  Staked,
  Withdrawn
} from "../../generated/HarvestPoolData/HarvestPoolData"
import { handleEntity } from "../utils/helpers"

export function handleRewardAdded(event: RewardAdded): void {
  handleEntity(
    event.address,
    null,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleRewardDenied(event: RewardDenied): void {
  handleEntity(
    event.address,
    null,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleRewardPaid(event: RewardPaid): void {
  handleEntity(
    event.address,
    null,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleStaked(event: Staked): void {
  handleEntity(
    event.address,
    null,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleWithdrawn(event: Withdrawn): void {
  handleEntity(
    event.address,
    null,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}
