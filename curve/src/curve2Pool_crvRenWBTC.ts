import {
  TokenExchange,
  AddLiquidity,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  Remove_liquidity_one_coinCall
} from "../generated/Curve2Pool_crvRenWBTC/Curve"
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
    "Curve2Pool_crvRenWBTC"
  )

  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_crvRenWBTC"
  )
}

export function handleAddLiquidity(event: AddLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_crvRenWBTC"
  )
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  handleUpdateVirtualPrice(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    "Curve2Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_crvRenWBTC"
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
    "Curve2Pool_crvRenWBTC"
  )

  handleUpdateOneBalance(
    call.to,
    call.inputs.i,
    call.transaction.hash,
    call.block.number,
    call.block.timestamp,
    "Curve2Pool_crvRenWBTC"
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
    "Curve2Pool_crvRenWBTC"
  )
  handleUpdateAllBalances(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    N_COINS_CURVE2POOL,
    "Curve2Pool_crvRenWBTC"
  )
}
