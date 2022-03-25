import { log } from "@graphprotocol/graph-ts";
import { PangolinPair as PairTemplate } from "../../../generated/templates";
import { PairCreated as PairCreatedEvent } from "../../../generated/PangolinFactory/PangolinFactory";

export function handlePairCreated(event: PairCreatedEvent): void {
  log.info("handling create pool. pair: {}", [event.params.pair.toHex()]);
  PairTemplate.create(event.params.pair);
}
