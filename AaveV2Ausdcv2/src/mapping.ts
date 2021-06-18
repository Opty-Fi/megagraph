import { Upgraded as UpgradedEvent } from "../generated/AaveV2Ausdcv2/AaveV2Ausdcv2"
import { Upgraded } from "../generated/schema"

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.implementation = event.params.implementation
  entity.save()
}
