import {
  AdminChanged as AdminChangedEvent,
  Upgraded as UpgradedEvent
} from "./InitializableAdminUpgradeabilityProxy"
import { AdminChanged, Upgraded } from "./schema"

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin
  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.implementation = event.params.implementation
  entity.save()
}
