import {
  CompSpeedUpdated as CompSpeedUpdatedEvent,
} from "../generated/Unitroller/Unitroller";
import { Comptroller } from "../generated/schema";
import { convertBINumToDesiredDecimals } from "./converters";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  let entity = Comptroller.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new Comptroller(event.transaction.hash.toHex());
  }
  
  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.token = event.transaction.hash.toHex(); // CreamToken's ID field
  entity.compSpeeds = convertBINumToDesiredDecimals(event.params.newSpeed, 18);
  
  entity.save();
}
