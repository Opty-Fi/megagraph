import { Deposited as DepositedEvent, Withdrawn as WithdrawnEvent } from '../../../generated/ConvexBooster/ConvexBooster';
import { handlePoolEntity } from "./handlers"

export function handleDeposited(event: DepositedEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.poolid
  )
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.poolid
  )
}
