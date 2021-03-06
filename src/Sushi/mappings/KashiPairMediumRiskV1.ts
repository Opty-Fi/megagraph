import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../../generated/SushiKashiPairMediumRiskV1/SushiKashiPairMediumRiskV1";
import { SushiKashiData } from "../../../generated/schema";
import { SushiKashiPairMediumRiskV1 } from "../../../generated/SushiKashiPairMediumRiskV1/SushiKashiPairMediumRiskV1";
import { SushiERC20Minimal } from "../../../generated/SushiKashiPairMediumRiskV1/SushiERC20Minimal";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";

export function handleTransfer(event: TransferEvent): void {
  handleKashiPair(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}

function handleKashiPair(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, vault: Address): void {
  let entity = SushiKashiData.load(txnHash.toHex());
  if (!entity) entity = new SushiKashiData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.vault = vault;

  let contract = SushiKashiPairMediumRiskV1.bind(vault);

  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("symbol() reverted", []);
  } else {
    entity.symbol = symbolResult.value;
  }

  let assetResult = contract.try_asset();
  if (assetResult.reverted) {
    log.warning("asset() reverted", []);
  } else {
    entity.assetToken = assetResult.value;
  }

  let collateralResult = contract.try_collateral();
  if (collateralResult.reverted) {
    log.warning("collateral() reverted", []);
  } else {
    entity.collateralToken = collateralResult.value;
  }

  let decimals = 18; // fallback
  let decimalsResult = contract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted", []);
  } else {
    decimals = decimalsResult.value;
  }
  entity.decimals = decimals;

  let accrueInfoResult = contract.try_accrueInfo();
  if (accrueInfoResult.reverted) {
    log.warning("accrueInfo() reverted", []);
  } else {
    entity.interestPerSecond = convertBINumToDesiredDecimals(accrueInfoResult.value.value0, decimals);
  }

  let assetDecimals = 18; // fallback
  let assetContract = SushiERC20Minimal.bind(convertBytesToAddress(entity.assetToken));
  decimalsResult = assetContract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted", []);
  } else {
    assetDecimals = decimalsResult.value;
  }

  let totalAssetResult = contract.try_totalAsset();
  if (totalAssetResult.reverted) {
    log.warning("totalAsset() reverted", []);
  } else {
    entity.totalAssetBase = convertBINumToDesiredDecimals(totalAssetResult.value.value1, assetDecimals);
  }

  entity.save();
}
