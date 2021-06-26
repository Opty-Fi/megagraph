import {
  TokenExchange,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  Remove_liquidity_one_coinCall
} from "../generated/Curve3Pool/Curve"
import {
  N_COINS_CURVE3POOL,
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
    "Curve3Pool"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve3Pool"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve3Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve3Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
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
    "Curve3Pool"
  )

  handleUpdateOneBalance(
    call.to,
    call.inputs.i,
    call.transaction.hash,
    call.block.number,
    call.block.timestamp,
    "Curve3Pool"
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
    "Curve3Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
  )
}
