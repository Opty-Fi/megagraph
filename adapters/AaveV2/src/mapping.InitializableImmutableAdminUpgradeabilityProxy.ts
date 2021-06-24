import { Upgraded as UpgradedEvent } from "../generated/InitializableImmutableAdminUpgradeabilityProxy/InitializableImmutableAdminUpgradeabilityProxy"
import { InitializableImmutableAdminUpgradeabilityProxyUpgraded } from "../generated/schema"

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new InitializableImmutableAdminUpgradeabilityProxyUpgraded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.implementation = event.params.implementation
  entity.save()
}
