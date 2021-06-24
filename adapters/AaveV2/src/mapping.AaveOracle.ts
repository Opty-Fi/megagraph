import {
  AssetSourceUpdated as AssetSourceUpdatedEvent,
  FallbackOracleUpdated as FallbackOracleUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  WethSet as WethSetEvent
} from "../generated/AaveOracle/AaveOracle"
import {
  AaveOracleAssetSourceUpdated,
  AaveOracleFallbackOracleUpdated,
  AaveOracleOwnershipTransferred,
  AaveOracleWethSet
} from "../generated/schema"

export function handleAssetSourceUpdated(event: AssetSourceUpdatedEvent): void {
  let entity = new AaveOracleAssetSourceUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.asset = event.params.asset
  entity.source = event.params.source
  entity.save()
}

export function handleFallbackOracleUpdated(
  event: FallbackOracleUpdatedEvent
): void {
  let entity = new AaveOracleFallbackOracleUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.fallbackOracle = event.params.fallbackOracle
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new AaveOracleOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleWethSet(event: WethSetEvent): void {
  let entity = new AaveOracleWethSet(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.weth = event.params.weth
  entity.save()
}
