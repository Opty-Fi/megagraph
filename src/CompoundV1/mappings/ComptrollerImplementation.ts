import { CompSpeedUpdated as CompSpeedUpdatedEvent } from "../../../generated/CompoundV1ComptrollerImplementation/CompoundV1ComptrollerImplementation";
import { handleEntity } from "./handlers";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // comptrollerAddress
    event.params.newSpeed,
    event.params.cToken,
    null, // borrowIndex
    null, // totalBorrows
  );
}
