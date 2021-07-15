import {
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve4Pool/Curve"
import { N_COINS_CURVE4POOL, updatePoolData } from "./helper"

export function handleTokenExchangeUnderlying(
  event: TokenExchangeUnderlying
): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}

export function handleRemoveLiquidityImbalance(
  event: RemoveLiquidityImbalance
): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}
