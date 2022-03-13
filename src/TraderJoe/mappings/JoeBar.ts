import { Transfer as TransferEvent } from "../../../generated/TraderJoeJoeBar/TraderJoeJoeBar";
import { handleEntity } from "./handlerStaking";
export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.from,
    event.params.to,
    event.params.value,
  );
}
