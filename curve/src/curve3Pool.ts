import {
  TokenExchange,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve3Pool/Curve"
import { N_COINS_CURVE3POOL, updatePoolData } from "./helper"

export function handleTokenExchange(event: TokenExchange): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE3POOL,
    "Curve3Pool"
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
    N_COINS_CURVE3POOL,
    "Curve3Pool"
  )
}
