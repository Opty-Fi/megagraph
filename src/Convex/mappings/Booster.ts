import {
  Deposited as DepositedEvent,
  Withdrawn as WithdrawnEvent,
} from "../../../generated/ConvexBooster/ConvexBooster";
import { handleTokenEntity } from "./handlers";

export function handleDeposited(event: DepositedEvent): void {
  handleTokenEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.params.poolid);
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  handleTokenEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.params.poolid);
}
