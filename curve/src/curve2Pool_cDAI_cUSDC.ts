import {
  TokenExchange,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance
} from "../generated/Curve2Pool_cDAI_cUSDC/Curve"
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
    "Curve2Pool_cDAI_cUSDC"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_cDAI_cUSDC"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_cDAI_cUSDC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_cDAI_cUSDC"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_cDAI_cUSDC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_cDAI_cUSDC"
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
    "Curve2Pool_cDAI_cUSDC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_cDAI_cUSDC"
  )
}
