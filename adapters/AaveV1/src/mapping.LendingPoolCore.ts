import { ReserveUpdated as ReserveUpdatedEvent } from "../generated/LendingPoolCore/LendingPoolCore"
import { LendingPoolCoreReserveUpdated } from "../generated/schema"

export function handleReserveUpdated(event: ReserveUpdatedEvent): void {
  let entity = new LendingPoolCoreReserveUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.reserve = event.params.reserve
  entity.liquidityRate = event.params.liquidityRate
  entity.stableBorrowRate = event.params.stableBorrowRate
  entity.variableBorrowRate = event.params.variableBorrowRate
  entity.liquidityIndex = event.params.liquidityIndex
  entity.variableBorrowIndex = event.params.variableBorrowIndex
  entity.save()
}
