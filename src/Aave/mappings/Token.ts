import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  AaveToken,
  BurnOnLiquidation as BurnOnLiquidationEvent,
  MintOnDeposit as MintOnDepositEvent,
} from "../../../generated/AaveTokenaDAI/AaveToken";
import { AaveTokenData } from "../../../generated/schema";
import { AaveLendingPoolAddressesProvider } from "../../../generated/AaveTokenaDAI/AaveLendingPoolAddressesProvider";
import { AaveLendingPoolDataProvider } from "../../../generated/AaveTokenaDAI/AaveLendingPoolDataProvider";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { Aave_POOL_PROVIDER_ADDRESS } from "../../utils/constants";

function handleAaveToken(transactionHash: Bytes, blockNumber: BigInt, blockTimestamp: BigInt, address: Address): void {
  let tokenContract = AaveToken.bind(address);

  let entity = AaveTokenData.load(transactionHash.toHex());
  if (!entity) entity = new AaveTokenData(transactionHash.toHex());

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;
  entity.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.symbol();

  log.debug("Saving Aave Token {} at address {} in block {} with txHash {}", [
    entity.symbol,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let underlyingAssetAddr = tokenContract.underlyingAssetAddress();
  entity.decimals = tokenContract.decimals();

  let poolProviderContract = AaveLendingPoolAddressesProvider.bind(Aave_POOL_PROVIDER_ADDRESS);
  let tried_getDataProvider = poolProviderContract.try_getLendingPoolDataProvider();
  if (tried_getDataProvider.reverted)
    log.error("poolProvider at {} call getDataProvider() reverted", [poolProviderContract._address.toHex()]);
  else {
    let dataProviderContract = AaveLendingPoolDataProvider.bind(tried_getDataProvider.value);

    let tried_getReserveConfigurationData = dataProviderContract.try_getReserveConfigurationData(underlyingAssetAddr);
    if (tried_getReserveConfigurationData.reverted)
      log.error("dataProvider at {} call getReserveConfigurationData({}) reverted", [
        dataProviderContract._address.toHex(),
        underlyingAssetAddr.toHex(),
      ]);
    else {
      let reserveConfData = tried_getReserveConfigurationData.value;
      entity.ltv = convertBINumToDesiredDecimals(reserveConfData.value0, 4);
      entity.liquidationThreshold = convertBINumToDesiredDecimals(reserveConfData.value1, 4);
      entity.liquidationBonus = convertBINumToDesiredDecimals(reserveConfData.value2, 4);
      entity.interestRateStrategyAddress = reserveConfData.value3;
      entity.usageAsCollateralEnabled = reserveConfData.value4;
      entity.borrowingEnabled = reserveConfData.value5;
      entity.stableBorrowRateEnabled = reserveConfData.value6;
      entity.isActive = reserveConfData.value7;
    }

    let tried_getReserveData = dataProviderContract.try_getReserveData(underlyingAssetAddr);
    if (tried_getReserveData.reverted)
      log.error("dataProvider at {} call getReserveData({}) reverted", [
        dataProviderContract._address.toHex(),
        underlyingAssetAddr.toHex(),
      ]);
    else {
      let reserveData = tried_getReserveData.value;
      entity.totalLiquidity = convertBINumToDesiredDecimals(reserveData.value0, entity.decimals);
      entity.availableLiquidity = convertBINumToDesiredDecimals(reserveData.value1, entity.decimals);
      entity.totalBorrowsStable = convertBINumToDesiredDecimals(reserveData.value2, 27);
      entity.totalBorrowsVariable = convertBINumToDesiredDecimals(reserveData.value3, 27);
      entity.liquidityRate = convertBINumToDesiredDecimals(reserveData.value4, 27);
      entity.variableBorrowRate = convertBINumToDesiredDecimals(reserveData.value5, 27);
      entity.stableBorrowRate = convertBINumToDesiredDecimals(reserveData.value6, 27);
      entity.averageStableBorrowRate = convertBINumToDesiredDecimals(reserveData.value7, 27);
      entity.utilizationRate = convertBINumToDesiredDecimals(reserveData.value8, 27);
      entity.liquidityIndex = reserveData.value9;
      entity.variableBorrowIndex = reserveData.value10;
      entity.aTokenAddress = reserveData.value11;
      entity.lastUpdateTimestamp = reserveData.value12;
    }
  }

  entity.save();
}

export function handleBurnOnLiquidation(event: BurnOnLiquidationEvent): void {
  handleAaveToken(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}

export function handleMintOnDeposit(event: MintOnDepositEvent): void {
  handleAaveToken(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}
