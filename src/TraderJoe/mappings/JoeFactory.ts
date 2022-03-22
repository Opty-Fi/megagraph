import { PairCreated as PairCreatedEvent } from "../../../generated/TraderJoeJoeFactory/TraderJoeJoeFactory";
import { handlePool } from "./handlerSwap";
export function handlePairCreated(event: PairCreatedEvent): void {
  handlePool(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.pair,
    event.params.token0,
    event.params.token1,
    event.params.param3,
  );
}
