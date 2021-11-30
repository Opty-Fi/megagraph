import {
  RewardAdded as RewardAddedEvent,
  RewardDenied as RewardDeniedEvent,
  RewardPaid as RewardPaidEvent,
  Staked as StakedEvent,
  Withdrawn as WithdrawnEvent,
} from "../../../generated/HarvestNoMintRewardPool/HarvestNoMintRewardPool";
import { handleEntity } from "./handlers";

export function handleRewardAdded(event: RewardAddedEvent): void {
  handleEntity(
    event.address, // poolAddr
    null, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp,
  );
}

export function handleRewardDenied(event: RewardDeniedEvent): void {
  handleEntity(
    event.address, // poolAddr
    null, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp,
  );
}

export function handleRewardPaid(event: RewardPaidEvent): void {
  handleEntity(
    event.address, // poolAddr
    null, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp,
  );
}

export function handleStaked(event: StakedEvent): void {
  handleEntity(
    event.address, // poolAddr
    null, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp,
  );
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  handleEntity(
    event.address, // poolAddr
    null, // vaultAddr
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp,
  );
}
