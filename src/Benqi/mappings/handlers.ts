import { BigInt, Address, log, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import { BenqiToken } from "../../../generated/BenqiTokenqiAVAX/BenqiToken";
import { BenqiTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_BYTES, ZERO_BI, ZERO_BD } from "../../utils/constants";

//  Function to add/update the qiToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  qiTokenAddress: Address,
  borrowIndex: BigInt | null,
  totalBorrows: BigInt | null,
): void {
  let qiTokenContract = BenqiToken.bind(qiTokenAddress);

  //  Load qiTokenData Entity for not having duplicates
  let entity = BenqiTokenData.load(transactionHash.toHex());
  if (entity == null) {
    entity = new BenqiTokenData(transactionHash.toHex());
  }

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.qiTokenAddress = qiTokenAddress;
  entity.qiTokenSymbol = qiTokenContract.try_symbol().reverted ? "" : qiTokenContract.symbol();

  if (totalBorrows === null) {
    if (qiTokenContract.try_totalBorrows().reverted) {
      entity.totalBorrows = null;
    } else {
      entity.totalBorrows = convertBINumToDesiredDecimals(qiTokenContract.totalBorrows(), 18);
    }
  } else {
    entity.totalBorrows = convertBINumToDesiredDecimals(totalBorrows, 18);
  }

  entity.totalBorrows = convertBINumToDesiredDecimals(
    borrowIndex === null
      ? qiTokenContract.try_borrowIndex().reverted
        ? ZERO_BI
        : qiTokenContract.borrowIndex()
      : borrowIndex,
    18,
  );

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

  entity.totalReserves = convertBINumToDesiredDecimals(
    qiTokenContract.try_totalReserves().reverted ? ZERO_BI : qiTokenContract.totalReserves(),
    18,
  );

  entity.totalSupply = convertBINumToDesiredDecimals(
    qiTokenContract.try_totalSupply().reverted ? ZERO_BI : qiTokenContract.totalSupply(),
    18,
  );

  entity.supplyReserveRatio = (!entity.totalSupply ? ZERO_BD : entity.totalSupply).div(
    !entity.totalReserves ? BigDecimal.fromString("1") : entity.totalReserves,
  );

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
