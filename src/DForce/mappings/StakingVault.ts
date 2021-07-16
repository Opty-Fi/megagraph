import { RewardAdded as RewardAddedEvent } from "../../../generated/DForceStakingVaultDAI/DForceStakingVault";
import { handleDTokenEntity } from "./handlers";

export function handleRewardRate(event: RewardAddedEvent): void {
  handleDTokenEntity(
    null,
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  );
}
