import { Transfer as TransferEvent } from "../../../generated/MaiCamAavecamAAVE/MaiCamAave";
import { log } from "@graphprotocol/graph-ts";

import { ZERO_ADDRESS } from "../../utils/constants";
import { handleCamToken } from "./handlers";
import { MaiCamAave } from "../../../generated/MaiCamAavecamAAVE/MaiCamAave";

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  if (from != ZERO_ADDRESS && to != ZERO_ADDRESS) {
    return;
  }
  let camType = "aave";

  if (from == ZERO_ADDRESS) {
    //mint
  } else if (to == ZERO_ADDRESS) {
    // burn
    value = value.neg();
  }
  let camContract = MaiCamAave.bind(event.address);
  let reserveAddress = ZERO_ADDRESS;
  let reserveResult = camContract.try_aave();
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
