import { Transfer as TransferEvent } from "../../../generated/MaiCamTokencamWMATIC/MaiCamToken";
import { ZERO_ADDRESS } from "../../utils/constants";
import { handleCamToken } from "./handlers";
export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  if (from == ZERO_ADDRESS) {
  } else if (to == ZERO_ADDRESS) {
  }
  handleCamToken(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}
