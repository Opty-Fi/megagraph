import { CompSpeedUpdated as CompSpeedUpdatedEvent } from "../../../generated/CompoundV1ComptrollerImplementation/CompoundV1ComptrollerImplementation";
import { createCTokenEntity } from "./handlers";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.cToken,
    event.address,
    null, // borrowIndex
    null // totalBorrows
  );
}
