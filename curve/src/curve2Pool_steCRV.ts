import {
  TokenExchange,
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  Remove_liquidity_one_coinCall
} from "../generated/Curve2Pool_steCRV/Curve"
import {
  N_COINS_CURVE2POOL,
  handleExchangeEvent,
  handleUpdateVirtualPrice,
  handleUpdateAllBalances,
  handleUpdateOneBalance
} from "./helper"

export function handleTokenExchange(event: TokenExchange): void {
  handleExchangeEvent(
    event.address,
    event.params.sold_id,
    event.params.bought_id,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_steCRV"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_steCRV"
  )
}

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
    "Curve2Pool_steCRV"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_steCRV"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_steCRV"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_steCRV"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_steCRV"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_steCRV"
  )
}

export function handleRemoveLiquidityOne(
  call: Remove_liquidity_one_coinCall
): void {
  handleUpdateVirtualPrice(
    call.to,
    call.transaction.hash,
    call.block.number,
    call.block.timestamp,
    "Curve2Pool_steCRV"
  )

  handleUpdateOneBalance(
    call.to,
    call.inputs.i,
    call.transaction.hash,
    call.block.number,
    call.block.timestamp,
    "Curve2Pool_steCRV"
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
    "Curve2Pool_steCRV"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_steCRV"
  )
}
