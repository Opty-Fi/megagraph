import { log } from "@graphprotocol/graph-ts";
import { MaiCamWMATIC, Transfer as TransferEvent } from "../../../generated/MaiCamWMATICcamWMATIC/MaiCamWMATIC";
import { ZERO_ADDRESS, ZERO_BI } from "../../utils/constants";
import { handleCamToken } from "./handlers";

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from;
  let to = event.params.to;

  // only interested on mints and burns.
  if (from != ZERO_ADDRESS && to != ZERO_ADDRESS) {
    return;
  }

  let camContract = MaiCamWMATIC.bind(event.address);
  let reserveAddress = ZERO_ADDRESS;
  let reserveResult = camContract.try_wMatic();
  let symbol = "";
  let decimals: i32 = 0;
  let amTokenAddress = ZERO_ADDRESS;
  if (reserveResult.reverted) {
    log.warning("try_wMatic() reverted", []);
  } else {
    reserveAddress = reserveResult.value;
  }
  let symbolResult = camContract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    symbol = symbolResult.value;
  }
  // updating entity decimals
  let decimalsResult = camContract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("try_decimals() reverted", []);
  } else {
    decimals = decimalsResult.value;
  }
  // finding amToken address
  let amContractResult = camContract.try_Token();
  if (amContractResult.reverted) {
    log.warning("try_Token() reverted", []);
  } else {
    let amContract = amContractResult.value;
    amTokenAddress = amContract;
  }
  let totalLiquidity = ZERO_BI;
  let totalLiquidityResult = camContract.try_totalSupply();
  if (totalLiquidityResult.reverted) {
    log.warning("try_Token() reverted", []);
  } else {
    totalLiquidity = totalLiquidityResult.value;
  }

  handleCamToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    reserveAddress,
    amTokenAddress,
    decimals,
    symbol,
    totalLiquidity,
  );
}
