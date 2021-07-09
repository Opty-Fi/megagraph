import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  AToken,
  Burn as BurnEvent,
  Mint as MintEvent,
} from "../generated/Adaiv2/AToken";
import {
  FromTokenToPool,
  AaveV2Token,
} from "../generated/schema";
// import { LendingPoolConfigurator } from "../generated/LendingPoolConfigurator/LendingPoolConfigurator";
import { AaveProtocolDataProvider } from "../generated/Adaiv2/AaveProtocolDataProvider";
import { AaveTokenV2 as UnderlyingAsset } from "../generated/Adaiv2/AaveTokenV2";
import { convertBINumToDesiredDecimals } from "./converters";

function handleAaveV2Token(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
): void {
  let tokenContract = AToken.bind(address);

  let entity = AaveV2Token.load(transactionHash.toHex());
  if (!entity) entity = new AaveV2Token(transactionHash.toHex());

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;
  entity.symbol = tokenContract.symbol();

  log.debug("Saving AaveV2 Token {} at address {} in block {} with txHash {}", [
    entity.symbol,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let dataProviderContract: AaveProtocolDataProvider = null;
  let entityFromTokenToPool = FromTokenToPool.load(address.toHex());
  if (!entityFromTokenToPool) entityFromTokenToPool = new FromTokenToPool(address.toHex());
  dataProviderContract = AaveProtocolDataProvider.bind(<Address>entityFromTokenToPool.pool);

  let underlyingAsset: Address = <Address>entityFromTokenToPool.underlyingAsset;
  let underlyingAssetContract = UnderlyingAsset.bind(underlyingAsset);
  let underlyingAssetDecimals = underlyingAssetContract.decimals();

  log.warning("dataprovider {} should be '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d': {}", [
    dataProviderContract._name,
    dataProviderContract._address.toHex(),
  ]);
  log.warning("underlyingasset: {}", [
    underlyingAsset.toHex(),
  ]);

  let tried_getReserveConfigurationData = dataProviderContract.try_getReserveConfigurationData(underlyingAsset);
  if (tried_getReserveConfigurationData.reverted) log.error("getReserveConfigurationData({}) reverted", [ underlyingAsset.toHex() ]);
  else {
    let reserveConfData = tried_getReserveConfigurationData.value.toMap();
    entity.decimals = reserveConfData.get("decimals").toI32();
    entity.ltv = convertBINumToDesiredDecimals(reserveConfData.get("ltv").toBigInt(), 4);
    entity.liquidationThreshold = convertBINumToDesiredDecimals(reserveConfData.get("liquidationThreshold").toBigInt(), 4);
    entity.liquidationBonus = convertBINumToDesiredDecimals(reserveConfData.get("liquidationBonus").toBigInt(), 4);
    entity.reserveFactor = convertBINumToDesiredDecimals(reserveConfData.get("reserveFactor").toBigInt(), 4);
    entity.usageAsCollateralEnabled = reserveConfData.get("usageAsCollateralEnabled").toBoolean();
    entity.borrowingEnabled = reserveConfData.get("borrowingEnabled").toBoolean();
    entity.stableBorrowRateEnabled = reserveConfData.get("stableBorrowRateEnabled").toBoolean();
    entity.isActive = reserveConfData.get("isActive").toBoolean();
    entity.isFrozen = reserveConfData.get("isFrozen").toBoolean();
  }
  
  let tried_getReserveData = dataProviderContract.try_getReserveData(underlyingAsset);
  if (tried_getReserveData.reverted) log.error("getReserveData({}) reverted", [ underlyingAsset.toHex() ]);
  else {
    let reserveData = tried_getReserveData.value.toMap();
    entity.availableLiquidity = convertBINumToDesiredDecimals(reserveData.get("availableLiquidity").toBigInt(), underlyingAssetDecimals);
    entity.totalStableDebt = convertBINumToDesiredDecimals(reserveData.get("totalStableDebt").toBigInt(), underlyingAssetDecimals);
    entity.totalVariableDebt = convertBINumToDesiredDecimals(reserveData.get("totalVariableDebt").toBigInt(), underlyingAssetDecimals);
    entity.liquidityRate = convertBINumToDesiredDecimals(reserveData.get("liquidityRate").toBigInt(), 27);
    entity.variableBorrowRate = convertBINumToDesiredDecimals(reserveData.get("variableBorrowRate").toBigInt(), 27);
    entity.stableBorrowRate = convertBINumToDesiredDecimals(reserveData.get("stableBorrowRate").toBigInt(), 27);
    entity.averageStableBorrowRate = convertBINumToDesiredDecimals(reserveData.get("averageStableBorrowRate").toBigInt(), 27);
    entity.liquidityIndex = convertBINumToDesiredDecimals(reserveData.get("liquidityIndex").toBigInt(), 27);
    entity.variableBorrowIndex = convertBINumToDesiredDecimals(reserveData.get("variableBorrowIndex").toBigInt(), 27);
    entity.lastUpdateTimestamp = reserveData.get("lastUpdateTimestamp").toBigInt();
  }

  entity.save();
}

export function handleBurn(event: BurnEvent): void {
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}

export function handleMint(event: MintEvent): void {
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}
