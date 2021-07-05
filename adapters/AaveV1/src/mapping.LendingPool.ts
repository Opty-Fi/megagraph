import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Borrow as BorrowEvent,
  Deposit as DepositEvent,
  FlashLoan as FlashLoanEvent,
  LiquidationCall as LiquidationCallEvent,
  OriginationFeeLiquidated as OriginationFeeLiquidatedEvent,
  RebalanceStableBorrowRate as RebalanceStableBorrowRateEvent,
  RedeemUnderlying as RedeemUnderlyingEvent,
  Repay as RepayEvent,
  ReserveUsedAsCollateralDisabled as ReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as ReserveUsedAsCollateralEnabledEvent,
  Swap as SwapEvent
} from "../generated/LendingPool/LendingPool";
import { FromTokenToPool, AaveV1Token } from "../generated/schema";
// import { AaveTokenV1 as UnderlyingAsset } from "./AaveTokenV1";
import { convertBINumToDesiredDecimals } from "./converters";

function handleToken(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  // todo
): void {
  // todo
}

export function handleBorrow(event: BorrowEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleDeposit(event: DepositEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleFlashLoan(event: FlashLoanEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleLiquidationCall(event: LiquidationCallEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleOriginationFeeLiquidated(
  event: OriginationFeeLiquidatedEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleRebalanceStableBorrowRate(
  event: RebalanceStableBorrowRateEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleRedeemUnderlying(event: RedeemUnderlyingEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleRepay(event: RepayEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleReserveUsedAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabledEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleReserveUsedAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabledEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleSwap(event: SwapEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}
