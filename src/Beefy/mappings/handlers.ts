import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { BeefyVault } from "../../../generated/BeefyVaultbifi-maxi/BeefyVault";
import { BeefyVaultData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

export function handleEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address,
): void {
  let entity = BeefyVaultData.load(txnHash.toHex());
  if (!entity) entity = new BeefyVaultData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.vault = vault;

  let contract = BeefyVault.bind(vault);

  let decimals = 18;
  let decimalsResult = contract.try_decimals();
  if (!decimalsResult.reverted) {
    decimals = decimalsResult.value;
  }

  let balanceResult = contract.try_balance();
  if (!balanceResult.reverted) {
    // TODO: really with decimals?
    entity.balance = convertBINumToDesiredDecimals(balanceResult.value, decimals);
  }

  let priceResult = contract.try_getPricePerFullShare();
  if (!priceResult.reverted) {
    entity.virtualPrice = convertBINumToDesiredDecimals(balanceResult.value, decimals);
  }

  let wantResult = contract.try_want();
  if (!wantResult.reverted) {
    entity.token = wantResult.value;
  }

  entity.save();
}
