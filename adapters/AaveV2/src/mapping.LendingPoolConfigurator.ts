import { log } from "@graphprotocol/graph-ts";
import { ReserveInitialized as ReserveInitializedEvent } from "../generated/LendingPoolConfigurator/LendingPoolConfigurator";
import { FromTokenToPool } from "../generated/schema";

export function handleReserveInitialized(event: ReserveInitializedEvent): void {
  let entity = FromTokenToPool.load(event.params.aToken.toHex());
  if (!entity) entity = new FromTokenToPool(event.params.aToken.toHex());

  entity.transactionHash = event.transaction.hash;
  entity.pool = event.address;
  entity.underlyingAsset = event.params.asset;

  log.debug("Saving token {} of asset {} with pool {} in txHash {}", [
    entity.id,
    entity.underlyingAsset.toString(),
    entity.pool.toString(),
    entity.transactionHash.toString(),
  ]);
  
  entity.save();
}
