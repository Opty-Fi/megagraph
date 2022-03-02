import { BigInt, Address, log, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import { BenqiToken } from "../../../generated/BenqiTokenqiAVAX/BenqiToken";
import { BenqiTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertToLowerCase } from "../../utils/converters";

//  Function to add/update the cToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  cTokenAddress: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
): void {
  let cTokenContract = BenqiToken.bind(cTokenAddress);

  ////  Load CTokenData Entity for not having duplicates
  let cTokenDataEntity = BenqiTokenData.load(transactionHash.toHex());
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new BenqiTokenData(transactionHash.toHex());
  }

  cTokenDataEntity.blockNumber = blockNumber;
  cTokenDataEntity.blockTimestamp = blockTimestamp;
  cTokenDataEntity.cTokenAddress = cTokenAddress;
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted ? null : cTokenContract.symbol();

  if (totalBorrows == null) {
    if (cTokenContract.try_totalBorrows().reverted){
      cTokenDataEntity.totalBorrows = null;
    } else {
      cTokenDataEntity.totalBorrows = convertBINumToDesiredDecimals(cTokenContract.totalBorrows(), 18);
    }
  } else {
    cTokenDataEntity.totalBorrows = convertBINumToDesiredDecimals(totalBorrows, 18);
  }
  
  if (borrowIndex == null) {
    if (cTokenContract.try_borrowIndex().reverted){
      cTokenDataEntity.totalBorrows = null;
    } else {
      cTokenDataEntity.totalBorrows = convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18);
    }
  } else {
    cTokenDataEntity.totalBorrows = convertBINumToDesiredDecimals(borrowIndex, 18);
  }

  if (cTokenContract.try_getCash().reverted) {
    cTokenDataEntity.totalCash = null;
  } else {
    cTokenDataEntity.totalCash = convertBINumToDesiredDecimals(cTokenContract.getCash(), 18);
  }
  
  if (cTokenContract.try_exchangeRateStored().reverted) {
    cTokenDataEntity.exchangeRate = null;
  } else {
    cTokenDataEntity.exchangeRate = convertBINumToDesiredDecimals(cTokenContract.exchangeRateStored(), 18);
  }
  
  if (cTokenContract.try_totalReserves().reverted) {
    cTokenDataEntity.totalReserves = null;
  } else {
    cTokenDataEntity.totalReserves = convertBINumToDesiredDecimals(cTokenContract.totalReserves(), 18);
  }
  
  if (cTokenContract.try_totalSupply().reverted) {
    cTokenDataEntity.totalSupply = null;
  } else {
    cTokenDataEntity.totalSupply = convertBINumToDesiredDecimals(cTokenContract.totalSupply(), 18);
  }

  if(cTokenDataEntity.totalSupply == null || cTokenDataEntity.totalReserves == null )
    cTokenDataEntity.SupplyReserveRatio  = null
  else
      cTokenDataEntity.SupplyReserveRatio = cTokenDataEntity.totalSupply.div(cTokenDataEntity.totalReserves)
  
  if (cTokenContract.try_supplyRatePerTimestamp().reverted) {
    cTokenDataEntity.supplyRatePerTimestamp = null;
  } else {
    cTokenDataEntity.supplyRatePerTimestamp = convertBINumToDesiredDecimals(cTokenContract.supplyRatePerTimestamp(), 18);
  }

  log.info("Saving data for cToken: {} - {} for block: {} with transaction hash: {}", [
    cTokenDataEntity.cTokenAddress.toHex(),
    cTokenDataEntity.cTokenSymbol,
    cTokenDataEntity.blockNumber.toString(),
    cTokenDataEntity.id,
  ]);


  cTokenDataEntity.save();
}
