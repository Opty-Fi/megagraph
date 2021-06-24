import {
  MarketBorrowRateSet as MarketBorrowRateSetEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/LendingRateOracle/LendingRateOracle"
import { LendingRateOracleMarketBorrowRateSet, LendingRateOracleOwnershipTransferred } from "../generated/schema"

export function handleMarketBorrowRateSet(
  event: MarketBorrowRateSetEvent
): void {
  let entity = new LendingRateOracleMarketBorrowRateSet(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.asset = event.params.asset
  entity.rate = event.params.rate
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new LendingRateOracleOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
