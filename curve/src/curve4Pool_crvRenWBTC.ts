import {
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve4Pool_crvRenWBTC/Curve"
import {
  N_COINS_CURVE4POOL,
  handleExchangeEvent,
  handleUpdateVirtualPrice,
  handleUpdateAllBalances
} from "./helper"

export function handleTokenExchangeUnderlying(
  event: TokenExchangeUnderlying
): void {
  handleExchangeEvent(
    event.address,
    event.params.sold_id,
    event.params.bought_id,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool_crvRenWBTC"
  )
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool_crvRenWBTC"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool_crvRenWBTC"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool_crvRenWBTC"
  )
}

export function handleRemoveLiquidityImbalance(
  event: RemoveLiquidityImbalance
): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool_crvRenWBTC"
  )
}
