import {
  TokenExchange,
  TokenExchangeUnderlying,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve2Pool/Curve"
import {
  N_COINS_CURVE2POOL,
  handleUpdateVirtualPrice,
  handleUpdateAllBalances
} from "./helper"
import { CurvePoolData } from "../generated/schema"

export function handleTokenExchange(event: TokenExchange): void {
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }

  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool"
  )
}

export function handleTokenExchangeUnderlying(
  event: TokenExchangeUnderlying
): void {
  let CurveBlock = CurvePoolData.load(event.block.number.toString())
  if (!CurveBlock) {
    CurveBlock = new CurvePoolData(event.block.number.toString())
    CurveBlock.save()
  }
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool"
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
    "Curve2Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
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
    "Curve2Pool"
  )
  handleUpdateAllBalances(
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
    "Curve2Pool"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool"
  )
}
