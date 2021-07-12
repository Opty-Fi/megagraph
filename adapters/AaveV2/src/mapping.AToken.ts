import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  AToken,
  Burn as BurnEvent,
  Mint as MintEvent,
} from "../generated/Adaiv2/AToken";
import { AaveV2TokenData } from "../generated/schema";
import { LendingPoolAddressesProvider } from "../generated/Adaiv2/LendingPoolAddressesProvider";
import { AaveProtocolDataProvider } from "../generated/Adaiv2/AaveProtocolDataProvider";
import { convertBINumToDesiredDecimals } from "./converters";

function handleAaveV2Token(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
): void {
  log.warning("entering", []);
  
  let POOL_PROVIDER_ADDRESS: Address = Address.fromString("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");
  let DATA_PROVIDER_INDEX: Bytes = <Bytes>Bytes.fromHexString("0x0100000000000000000000000000000000000000000000000000000000000000");

  let tokenContract = AToken.bind(address);

  let entity = AaveV2TokenData.load(transactionHash.toHex());
  if (!entity) entity = new AaveV2TokenData(transactionHash.toHex());

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
  let poolProviderContract = LendingPoolAddressesProvider.bind(POOL_PROVIDER_ADDRESS);
  let tried_dataProviderAddr = poolProviderContract.try_getAddress(DATA_PROVIDER_INDEX);
  if (tried_dataProviderAddr.reverted) log.error("poolProvider at {} call poolProvider({}) reverted", [ poolProviderContract._address.toHex(), DATA_PROVIDER_INDEX.toHex() ]);
  else dataProviderContract = AaveProtocolDataProvider.bind(tried_dataProviderAddr.value);

  let underlyingAssetAddr = tokenContract.UNDERLYING_ASSET_ADDRESS();

  log.warning("0x057835ad21a177dbdd3090bb1cae03eacf78fc6d, dataProv {}", [ dataProviderContract._address.toHex() ]);
  log.warning("underlying {}", [ underlyingAssetAddr.toHex() ]);
  let tried_getReserveConfigurationData = dataProviderContract.try_getReserveConfigurationData(underlyingAssetAddr);
  if (tried_getReserveConfigurationData.reverted) log.error("getReserveConfigurationData({}) reverted", [ underlyingAssetAddr.toHex() ]);
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
  
  let tried_getReserveData = dataProviderContract.try_getReserveData(underlyingAssetAddr);
  if (tried_getReserveData.reverted) log.error("getReserveData({}) reverted", [ underlyingAssetAddr.toHex() ]);
  else {
    let reserveData = tried_getReserveData.value.toMap();
    entity.availableLiquidity = convertBINumToDesiredDecimals(reserveData.get("availableLiquidity").toBigInt(), entity.decimals);
    entity.totalStableDebt = convertBINumToDesiredDecimals(reserveData.get("totalStableDebt").toBigInt(), entity.decimals);
    entity.totalVariableDebt = convertBINumToDesiredDecimals(reserveData.get("totalVariableDebt").toBigInt(), entity.decimals);
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
  log.warning("handleBurn", []);
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}

export function handleMint(event: MintEvent): void {
  log.warning("handleMint", []);
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
  );
}
