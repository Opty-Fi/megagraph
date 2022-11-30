import {
  Staked as StakeEvent,
  Withdrawn as WithdrawnEvent,
} from "../../../generated/PangolinStakingRewards/PangolinStakingRewards";
import { handleStakingEntity } from "./handleStakingEntity";

export function handleStaked(event: StakeEvent): void {
  handleStakingEntity(event.transaction.hash, event.block.number, event.block.timestamp, "Stake");
}
export function handleWithdrawn(event: WithdrawnEvent): void {
  handleStakingEntity(event.transaction.hash, event.block.number, event.block.timestamp, "Withdraw");
}
