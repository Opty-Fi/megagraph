import { Transfer as TransferEvent } from "../../../generated/BeefyVaultbifi-maxi/BeefyVault";
import { handleEntity } from "./handlers";

export function handleTransfer(event: TransferEvent): void {
  handleEntity(event.transaction.hash, event.block.number, event.block.timestamp, event.address);
}
