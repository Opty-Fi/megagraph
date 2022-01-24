import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { AaveV2Token, Burn as BurnEvent, Mint as MintEvent } from "../../../generated/AaveV2Token/AaveV2Token";
import { AaveV2TokenData, AaveV2Reserve } from "../../../generated/schema";
import { AaveV2LendingPoolAddressesProvider } from "../../../generated/AaveV2Token/AaveV2LendingPoolAddressesProvider";
import { AaveV2IncentivesController } from "../../../generated/AaveV2Token/AaveV2IncentivesController";
import { AaveV2AaveProtocolDataProvider } from "../../../generated/AaveV2Token/AaveV2AaveProtocolDataProvider";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { AaveV2_POOL_PROVIDER_ADDRESS, AaveV2_DATA_PROVIDER_INDEX } from "./constants";

function handleAaveV2Token(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  value: BigInt,
): void {
  let tokenContract = AaveV2Token.bind(address);

  let entity = AaveV2TokenData.load(transactionHash.toHex());

  if (!entity) {
    entity = new AaveV2TokenData(transactionHash.toHex());
    entity.totalLiquidity = BigInt.fromI32(0);
  }

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;
  entity.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.symbol();

  log.debug("Saving AaveV2 Token {} at address {} in block {} with txHash {}", [
    entity.symbol,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let underlyingAssetAddr = tokenContract.UNDERLYING_ASSET_ADDRESS();

  let poolProviderContract = AaveV2LendingPoolAddressesProvider.bind(AaveV2_POOL_PROVIDER_ADDRESS);
  let tried_getDataProvider = poolProviderContract.try_getAddress(AaveV2_DATA_PROVIDER_INDEX);
  if (tried_getDataProvider.reverted) {
    log.error("poolProvider at {} call getDataProvider({}) reverted", [
      poolProviderContract._address.toHex(),
      AaveV2_DATA_PROVIDER_INDEX.toHex(),
    ]);
  } else {
    let dataProviderContract = AaveV2AaveProtocolDataProvider.bind(tried_getDataProvider.value);

    let tried_getReserveConfigurationData = dataProviderContract.try_getReserveConfigurationData(underlyingAssetAddr);
    if (tried_getReserveConfigurationData.reverted) {
      log.error("dataProvider at {} call getReserveConfigurationData({}) reverted", [
        dataProviderContract._address.toHex(),
        underlyingAssetAddr.toHex(),
      ]);
    } else {
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
    if (tried_getReserveData.reverted) {
      log.error("dataProvider at {} call getReserveData({}) reverted", [
        dataProviderContract._address.toHex(),
        underlyingAssetAddr.toHex(),
      ]);
    } else {
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

  // get aEmissionsPerSecond
  let tried_getIncentivesController = tokenContract.try_getIncentivesController();
  if (tried_getIncentivesController.reverted) {
    log.error("tokenContract at {} call getIncentivesController() reverted", [tokenContract._address.toHex()]);
  } else {
    let incentivesControllerAddress = tried_getIncentivesController.value;
    let incentivesControllerContract = AaveV2IncentivesController.bind(incentivesControllerAddress);
    let tried_assets = incentivesControllerContract.try_assets(address);

    if (tried_assets.reverted) {
      log.error("AaveIncentivesController at {} call assets({}) reverted", [
        incentivesControllerContract._address.toHex(),
        underlyingAssetAddr.toHex(),
      ]);
    } else {
      let assets = tried_assets.value;
      entity.aEmissionPerSecond = assets.value0;
    }
  }

  // get totalLiquidity per token
  let reserveId = address.toHexString();
  let reserve = AaveV2Reserve.load(reserveId);

  if (!reserve) {
    reserve = new AaveV2Reserve(reserveId);
    reserve.address = address;
    reserve.symbol = entity.symbol;
    reserve.totalLiquidity = BigInt.fromI32(0);
  }

  reserve.totalLiquidity = reserve.totalLiquidity.plus(value);
  entity.totalLiquidity = reserve.totalLiquidity;

  reserve.save();
  entity.save();
}

export function handleBurn(event: BurnEvent): void {
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.value.neg(),
  );
}

export function handleMint(event: MintEvent): void {
  handleAaveV2Token(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.value,
  );
}
