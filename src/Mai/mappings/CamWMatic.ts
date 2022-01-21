import { Transfer as TransferEvent } from "../../../generated/MaiCamWMATICcamWMATIC/MaiCamWMATIC";
import { ZERO_ADDRESS } from "../../utils/constants";
import { log } from "@graphprotocol/graph-ts";
import { MaiCamWMATIC } from "../../../generated/MaiCamWMATICcamWMATIC/MaiCamWMATIC";

import { handleCamToken } from "./handlers";
export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;

  if (from != ZERO_ADDRESS && to != ZERO_ADDRESS) {
    return;
  }
  let camType = "token";

  if (from == ZERO_ADDRESS) {
    //mint
  } else if (to == ZERO_ADDRESS) {
    // burn
    value = value.neg();
  }
  let camContract = MaiCamWMATIC.bind(event.address);
  let reserveAddress = ZERO_ADDRESS;
  let reserveResult = camContract.try_wMatic();
  if (reserveResult.reverted) {
    log.error("try_usdc() reverted", []);
  } else {
    reserveAddress = reserveResult.value;
  }

  handleCamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    value,
    camType,
    reserveAddress,
  );
}
