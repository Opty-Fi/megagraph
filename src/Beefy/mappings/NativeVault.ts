import {
  Transfer as TransferEvent,
  BeefyNativeVault,
} from "../../../generated/BeefyNativeVaultaave-matic/BeefyNativeVault";
import { log } from "@graphprotocol/graph-ts";
import { BeefyVaultData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

// difference to Vault.ts: wmatic() instead of want()

export function handleTransfer(event: TransferEvent): void {
  let id = event.transaction.hash.toHex();
  let block = event.block;
  let vault = event.address;

  let entity = BeefyVaultData.load(id);
  if (!entity) entity = new BeefyVaultData(id);

  entity.blockNumber = block.number;
  entity.blockTimestamp = block.timestamp;
  entity.vault = vault;

  let contract = BeefyNativeVault.bind(vault);

  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    log.warning("name() reverted for {}", [vault.toString()]);
  } else {
    entity.name = nameResult.value;
  }

  let decimals = 18; // fallback
  let decimalsResult = contract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted for {}", [vault.toString()]);
  } else {
    decimals = decimalsResult.value;
    entity.decimals = decimals;
  }

  let balanceResult = contract.try_balance();
  if (balanceResult.reverted) {
    log.warning("balance() reverted for {}", [vault.toString()]);
  } else {
    // TODO: really with decimals?
    entity.balance = convertBINumToDesiredDecimals(balanceResult.value, decimals);
  }

  let priceResult = contract.try_getPricePerFullShare();
  if (priceResult.reverted) {
    log.warning("getPricePerFullShare() reverted for {}", [vault.toString()]);
  } else {
    entity.virtualPrice = convertBINumToDesiredDecimals(balanceResult.value, decimals);
  }

  let wmaticResult = contract.try_wmatic();
  if (wmaticResult.reverted) {
    log.warning("wmatic() reverted for {}", [vault.toString()]);
  } else {
    entity.token = wmaticResult.value;
  }

  entity.save();
}
