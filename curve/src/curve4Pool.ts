import {
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve4Pool/Curve"
import {
  N_COINS_CURVE4POOL,
  handleUpdateVirtualPrice,
  handleUpdateAllBalances
} from "./helper"
import { CurvePoolData } from "../generated/schema"

export function handleTokenExchangeUnderlying(
  event: TokenExchangeUnderlying
): void {
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool"
  )
  handleUpdateAllBalances(
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
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve4Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE4POOL,
    "Curve4Pool"
  )
}
