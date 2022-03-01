import { BigInt, Address, log, Bytes } from "@graphprotocol/graph-ts";
import { Token } from "../../../generated/Token/Token";
import { QiTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertToLowerCase } from "../../utils/converters";

//  Function to add/update the cToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  comptrollerAddress: Address,
  cTokenAddress: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
): void {
  let cTokenContract = Token.bind(cTokenAddress);

  ////  Load CTokenData Entity for not having duplicates
  let cTokenDataEntity = QiTokenData.load(transactionHash.toHex());
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new QiTokenData(transactionHash.toHex());
  }

  cTokenDataEntity.blockNumber = blockNumber;
  cTokenDataEntity.blockTimestamp = blockTimestamp;
  cTokenDataEntity.cTokenAddress = cTokenAddress;
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted ? null : cTokenContract.symbol();

  cTokenDataEntity.totalBorrows =
    totalBorrows == null
      ? cTokenContract.try_totalBorrows().reverted
        ? null
        : convertBINumToDesiredDecimals(
          cTokenContract.totalBorrows(), 18)
      : convertBINumToDesiredDecimals(
        totalBorrows, 18);

  cTokenDataEntity.borrowIndex =
    borrowIndex == null
      ? cTokenContract.try_borrowIndex().reverted
        ? null
        : convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18)
      : convertBINumToDesiredDecimals(borrowIndex, 18);

  cTokenDataEntity.totalCash = cTokenContract.try_getCash().reverted
    ? null
    : convertBINumToDesiredDecimals(
      cTokenContract.getCash(), 18);

  cTokenDataEntity.exchangeRate = cTokenContract.try_exchangeRateStored().reverted
    ? null
    : convertBINumToDesiredDecimals(
      cTokenContract.exchangeRateStored(), 18 + 10);

  cTokenDataEntity.totalReserves = cTokenContract.try_totalReserves().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.totalReserves(), 18);
  cTokenDataEntity.totalSupply = cTokenContract.try_totalSupply().reverted
    ? null
    : cTokenContract.totalSupply();

  cTokenDataEntity.SupplyReserveRatio = cTokenDataEntity.totalSupply / cTokenDataEntity.totalReserves

  cTokenDataEntity.supplyRatePerTimestamp = cTokenContract.try_supplyRatePerBlock().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.supplyRatePerBlock(), 18);

  comptrollerAddress =
    comptrollerAddress == null
      ? cTokenContract.try_comptroller().reverted
        ? null
        : cTokenContract.comptroller()
      : comptrollerAddress;

  log.info("Saving data for cToken: {} - {} for block: {} with transaction hash: {}", [
    cTokenDataEntity.cTokenAddress.toHex(),
    cTokenDataEntity.cTokenSymbol,
    cTokenDataEntity.blockNumber.toString(),
    cTokenDataEntity.id,
  ]);


  cTokenDataEntity.save();
}
