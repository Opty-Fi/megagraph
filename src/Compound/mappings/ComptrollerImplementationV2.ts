import {
  CompBorrowSpeedUpdated as CompBorrowSpeedUpdatedEvent,
  CompSupplySpeedUpdated as CompSupplySpeedUpdatedEvent,
} from "../../../generated/CompoundComptrollerImplementationV2/CompoundComptrollerImplementationV2";
import { handleEntity } from "./handlers";

export function handleCompBorrowSpeedUpdated(event: CompBorrowSpeedUpdatedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // comptrollerAddress
    event.params.newSpeed, // newBorrowSpeed
    null, // newSupplySpeed
    event.params.cToken,
    null, // borrowIndex
    null, // totalBorrows
  );
}

export function handleCompSupplySpeedUpdated(event: CompSupplySpeedUpdatedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // comptrollerAddress
    null, // newBorrowSpeed
    event.params.newSpeed, // newSupplySpeed
    event.params.cToken,
    null, // borrowIndex
    null, // totalBorrows
  );
}
