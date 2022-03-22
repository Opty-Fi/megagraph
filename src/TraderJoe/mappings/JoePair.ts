import { Swap as SwapEvent } from "../../../generated/templates/TraderJoeJoePair/TraderJoeJoePair";

import { handleEntity } from "./handlerSwap";
export function handleSwap(event: SwapEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.amount0In,
    event.params.amount0Out,
    event.params.amount1In,
    event.params.amount1Out,
    event.address,
  );
}
