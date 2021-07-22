import { CompSpeedUpdated as CompSpeedUpdatedEvent } from "../../../generated/CreamComptrollerImplementation/CreamComptrollerImplementation";
import { handleEntity } from "./handlers";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.cToken,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}
