import {
  RewardAdded as RewardAddedEvent,
  Staked as StakedEvent,
  Withdrawn as WithdrawnEvent,
} from "../../../generated/QuickSwapStakingRewardsUSDC-WETH/QuickSwapStakingRewards";
import { handlePoolEntity } from "./handlers";

export function handleRewardAdded(event: RewardAddedEvent): void {
  handlePoolEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}

export function handleStaked(event: StakedEvent): void {
  handlePoolEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  handlePoolEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}
