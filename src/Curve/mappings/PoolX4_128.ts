import {
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurvePoolX4_128/CurvePoolX4_128";
import { Curve_N_COINS_CURVE4POOL } from "../../utils/constants";
import { handlePoolEntity } from "./handlers";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    Curve_N_COINS_CURVE4POOL,
    "Curve4Pool_128",
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    Curve_N_COINS_CURVE4POOL,
    "Curve4Pool_128",
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    Curve_N_COINS_CURVE4POOL,
    "Curve4Pool_128",
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    Curve_N_COINS_CURVE4POOL,
    "Curve4Pool_128",
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    Curve_N_COINS_CURVE4POOL,
    "Curve4Pool_128",
  );
}