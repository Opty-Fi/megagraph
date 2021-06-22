import { Upgraded as UpgradedEvent } from "./InitializableImmutableAdminUpgradeabilityProxy"
import { Upgraded } from "./schema"

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.implementation = event.params.implementation
  entity.save()
}
