import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  AavePolygonToken,
  Burn as BurnEvent,
  Mint as MintEvent,
} from "../../../generated/AavePolygonTokenamDAI/AavePolygonToken";
import { AavePolygonTokenData } from "../../../generated/schema";
import { AavePolygonLendingPoolAddressesProvider } from "../../../generated/AavePolygonTokenamDAI/AavePolygonLendingPoolAddressesProvider";
import { AavePolygonAaveProtocolDataProvider } from "../../../generated/AavePolygonTokenamDAI/AavePolygonAaveProtocolDataProvider";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { AavePolygon_POOL_PROVIDER_ADDRESS, AavePolygon_DATA_PROVIDER_INDEX } from "../../utils/constants";

function handleAavePolygonToken(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
): void {
  let tokenContract = AavePolygonToken.bind(address);

  let entity = AavePolygonTokenData.load(transactionHash.toHex());
  if (!entity) entity = new AavePolygonTokenData(transactionHash.toHex());

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;
  entity.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.symbol();

  log.debug("Saving AavePolygon Token {} at address {} in block {} with txHash {}", [
    entity.symbol,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let underlyingAssetAddr = tokenContract.UNDERLYING_ASSET_ADDRESS();

  let poolProviderContract = AavePolygonLendingPoolAddressesProvider.bind(AavePolygon_POOL_PROVIDER_ADDRESS);
  let tried_getDataProvider = poolProviderContract.try_getAddress(AavePolygon_DATA_PROVIDER_INDEX);
  if (tried_getDataProvider.reverted) log.error("poolProvider at {} call getDataProvider({}) reverted", [ poolProviderContract._address.toHex(), AavePolygon_DATA_PROVIDER_INDEX.toHex() ]);
  else {
    let dataProviderContract = AavePolygonAaveProtocolDataProvider.bind(tried_getDataProvider.value);
    
    let tried_getReserveConfigurationData = dataProviderContract.try_getReserveConfigurationData(underlyingAssetAddr);
    if (tried_getReserveConfigurationData.reverted) log.error("dataProvider at {} call getReserveConfigurationData({}) reverted", [ dataProviderContract._address.toHex(), underlyingAssetAddr.toHex() ]);
    else {
      let reserveConfData = tried_getReserveConfigurationData.value;
      entity.decimals = reserveConfData.value0.toI32();
      entity.ltv = convertBINumToDesiredDecimals(reserveConfData.value1, 4);
      entity.liquidationThreshold = convertBINumToDesiredDecimals(reserveConfData.value2, 4);
      entity.liquidationBonus = convertBINumToDesiredDecimals(reserveConfData.value3, 4);
      entity.reserveFactor = convertBINumToDesiredDecimals(reserveConfData.value4, 4);
      entity.usageAsCollateralEnabled = reserveConfData.value5;
      entity.borrowingEnabled = reserveConfData.value6;
      entity.stableBorrowRateEnabled = reserveConfData.value7;
      entity.isActive = reserveConfData.value8;
      entity.isFrozen = reserveConfData.value9;
    }

    let tried_getReserveData = dataProviderContract.try_getReserveData(underlyingAssetAddr);
    if (tried_getReserveData.reverted) log.error("dataProvider at {} call getReserveConfigurationData({}) reverted", [ dataProviderContract._address.toHex(), underlyingAssetAddr.toHex() ]);
    else {
      let reserveData = tried_getReserveData.value;
      entity.availableLiquidity = convertBINumToDesiredDecimals(reserveData.value0, entity.decimals);
      entity.totalStableDebt = convertBINumToDesiredDecimals(reserveData.value1, entity.decimals);
      entity.totalVariableDebt = convertBINumToDesiredDecimals(reserveData.value2, entity.decimals);
      entity.liquidityRate = convertBINumToDesiredDecimals(reserveData.value3, 27);
      entity.variableBorrowRate = convertBINumToDesiredDecimals(reserveData.value4, 27);
      entity.stableBorrowRate = convertBINumToDesiredDecimals(reserveData.value5, 27);
      entity.averageStableBorrowRate = convertBINumToDesiredDecimals(reserveData.value6, 27);
      entity.liquidityIndex = convertBINumToDesiredDecimals(reserveData.value7, 27);
      entity.variableBorrowIndex = convertBINumToDesiredDecimals(reserveData.value8, 27);
      entity.lastUpdateTimestamp = reserveData.value9;
    }
  }

  entity.save();
}

export function handleBurn(event: BurnEvent): void {
  handleAavePolygonToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}

export function handleMint(event: MintEvent): void {
  handleAavePolygonToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}
