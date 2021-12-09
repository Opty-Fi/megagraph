import { Transfer as TransferEvent } from "../../../generated/SushiKashiPairMediumRiskV1/SushiKashiPairMediumRiskV1";
import { handleKashiPair } from "./handlers";

export function handleTransfer(event: TransferEvent): void {
  handleKashiPair(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address
  )
}
