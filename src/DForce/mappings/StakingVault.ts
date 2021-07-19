import { RewardAdded as RewardAddedEvent } from "../../../generated/DForceTokendDAI/DForceStakingVault";
import { handleDTokenEntity } from "./handlers";

export function handleRewardAdded(event: RewardAddedEvent): void {
  handleDTokenEntity(
    null, // dTokenAddress
    event.address, // dforceStakingVaultAddress
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  );
}
