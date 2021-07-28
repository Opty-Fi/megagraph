import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
} from "../../../generated/CurveV1PoolX3DAI+USDC+USDT/CurveV1PoolX3";
import { CurveV1_N_COINS_CURVE3POOL } from "../../utils/constants";
import { handlePoolEntity } from "./handlers";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE3POOL,
    "Curve3Pool"
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE3POOL,
    "Curve3Pool"
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE3POOL,
    "Curve3Pool"
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    CurveV1_N_COINS_CURVE3POOL,
    "Curve3Pool"
  );
}
