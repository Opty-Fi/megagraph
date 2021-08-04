import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurveV1PoolX4yDAI+yUSDC+yUSDT+yTUSD/CurveV1PoolX4";
import { CurveV1_N_COINS_CURVE4POOL } from "../../utils/constants";
import { handlePoolEntity } from "./handlers";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE4POOL,
    "Curve4Pool"
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE4POOL,
    "Curve4Pool"
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE4POOL,
    "Curve4Pool"
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE4POOL,
    "Curve4Pool"
  );
}
