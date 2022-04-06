import { log } from "@graphprotocol/graph-ts";
import { TraderJoeJoePair as PairTemplate } from "../../../generated/templates";
import { PairCreated as PairCreatedEvent } from "../../../generated/TraderJoeJoeFactory/TraderJoeJoeFactory";

export function handlePairCreated(event: PairCreatedEvent): void {
  log.info("handling create pool. pair: {}", [event.params.pair.toHex()]);
  PairTemplate.create(event.params.pair);
}
