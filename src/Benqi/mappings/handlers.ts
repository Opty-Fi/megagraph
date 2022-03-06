import { BigInt, Address, log, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import { BenqiToken } from "../../../generated/BenqiTokenqiAVAX/BenqiToken";
import { BenqiTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

//  Function to add/update the qiToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  qiTokenAddress: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
): void {
  let qiTokenContract = BenqiToken.bind(qiTokenAddress);

  ////  Load qiTokenData Entity for not having duplicates
  let entity = BenqiTokenData.load(transactionHash.toHex());
  if (entity == null) {
    entity = new BenqiTokenData(transactionHash.toHex());
  }

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.qiTokenAddress = qiTokenAddress;
  entity.qiTokenSymbol = qiTokenContract.try_symbol().reverted ? null : qiTokenContract.symbol();

  if (totalBorrows == null) {
    if (qiTokenContract.try_totalBorrows().reverted) {
      entity.totalBorrows = null;
    } else {
      entity.totalBorrows = convertBINumToDesiredDecimals(qiTokenContract.totalBorrows(), 18);
    }
  } else {
    entity.totalBorrows = convertBINumToDesiredDecimals(totalBorrows, 18);
  }

  if (borrowIndex == null) {
    if (qiTokenContract.try_borrowIndex().reverted) {
      entity.totalBorrows = null;
    } else {
      entity.totalBorrows = convertBINumToDesiredDecimals(qiTokenContract.borrowIndex(), 18);
    }
  } else {
    entity.totalBorrows = convertBINumToDesiredDecimals(borrowIndex, 18);
  }

  if (qiTokenContract.try_getCash().reverted) {
    entity.totalCash = null;
  } else {
    entity.totalCash = convertBINumToDesiredDecimals(qiTokenContract.getCash(), 18);
  }

  if (qiTokenContract.try_exchangeRateStored().reverted) {
    entity.exchangeRate = null;
  } else {
    entity.exchangeRate = convertBINumToDesiredDecimals(qiTokenContract.exchangeRateStored(), 18);
  }

  if (qiTokenContract.try_totalReserves().reverted) {
    entity.totalReserves = null;
  } else {
    entity.totalReserves = convertBINumToDesiredDecimals(qiTokenContract.totalReserves(), 18);
  }

  if (qiTokenContract.try_totalSupply().reverted) {
    entity.totalSupply = null;
  } else {
    entity.totalSupply = convertBINumToDesiredDecimals(qiTokenContract.totalSupply(), 18);
  }

  if (entity.totalSupply == null || entity.totalReserves == null) entity.SupplyReserveRatio = null;
  else entity.SupplyReserveRatio = entity.totalSupply.div(entity.totalReserves);

  if (qiTokenContract.try_supplyRatePerTimestamp().reverted) {
    entity.supplyRatePerTimestamp = null;
  } else {
    entity.supplyRatePerTimestamp = convertBINumToDesiredDecimals(qiTokenContract.supplyRatePerTimestamp(), 18);
  }

  log.info("Saving data for qiToken: {} - {} for block: {} with transaction hash: {}", [
    entity.qiTokenAddress.toHex(),
    entity.qiTokenSymbol,
    entity.blockNumber.toString(),
    entity.id,
  ]);

  entity.save();
}
