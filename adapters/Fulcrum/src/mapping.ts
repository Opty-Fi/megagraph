import { OwnershipTransferred as OwnershipTransferredEvent } from "../generated/bZxProtocol/bZxProtocol"
import { bZxProtocolOwnershipTransferred } from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new bZxProtocolOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
