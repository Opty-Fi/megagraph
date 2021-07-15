import {
  TokenExchange,
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve2Pool/Curve"
import { N_COINS_CURVE2POOL, updatePoolData } from "./helper"

export function handleTokenExchange(event: TokenExchange): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
}

export function handleTokenExchangeUnderlying(
  event: TokenExchangeUnderlying
): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  updatePoolData(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
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
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
}
