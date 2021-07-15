import { CompSpeedUpdated as CompSpeedUpdatedEvent } from '../../generated/Comptroller/ComptrollerImplementation'
import { createCTokenEntity } from './helpers'

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  createCTokenEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.cToken,
    event.address,
    null,
    null,
  )
}
