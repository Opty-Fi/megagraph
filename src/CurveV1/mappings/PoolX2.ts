import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurveV1PoolX2cDAI+cUSDC/CurveV1PoolX2";
import { CurveV1_N_COINS_CURVE2POOL } from "../../utils/constants";
import { handlePoolEntity } from "./handlers";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE2POOL,
    "Curve2Pool"
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE2POOL,
    "Curve2Pool"
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE2POOL,
    "Curve2Pool"
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE2POOL,
    "Curve2Pool"
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE2POOL,
    "Curve2Pool"
  );
}
