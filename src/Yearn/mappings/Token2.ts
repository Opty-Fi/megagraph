import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  YearnToken2,
  Transfer as TransferEvent,
} from "../../../generated/YearnToken2yvDAI/YearnToken2";
import { YearnTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_BD } from "../../utils/constants";

export function handleEntity(
  address: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  txnHash: string
): void {
  let contract = YearnToken2.bind(address);
  let yearnData = YearnTokenData.load(txnHash);

  let pricePerFullShare = contract.try_pricePerShare();
  let balance = contract.try_totalAssets();

  if (!yearnData) {
    yearnData = new YearnTokenData(txnHash);
  }

  yearnData.blockNumber = blockNumber;
  yearnData.blockTimestamp = timestamp;
  yearnData.underlyingToken = contract.token();
  yearnData.symbol = contract.symbol();
  yearnData.vault = address;

  yearnData.balance = !balance.reverted
    ? convertBINumToDesiredDecimals(balance.value, contract.decimals().toI32())
    : ZERO_BD;

  yearnData.pricePerFullShare = !pricePerFullShare.reverted
    ? convertBINumToDesiredDecimals(
        pricePerFullShare.value,
        contract.decimals().toI32()
      )
    : ZERO_BD;

  yearnData.save();
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString()
  );
}
