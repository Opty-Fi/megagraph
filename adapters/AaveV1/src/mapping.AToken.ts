import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  BalanceTransfer as BalanceTransferEvent,
  BurnOnLiquidation as BurnOnLiquidationEvent,
  InterestRedirectionAllowanceChanged as InterestRedirectionAllowanceChangedEvent,
  InterestStreamRedirected as InterestStreamRedirectedEvent,
  MintOnDeposit as MintOnDepositEvent,
  Redeem as RedeemEvent,
  RedirectedBalanceUpdated as RedirectedBalanceUpdatedEvent,
  Transfer as TransferEvent
} from "./AToken";
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

export function handleApproval(event: ApprovalEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleBalanceTransfer(event: BalanceTransferEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleBurnOnLiquidation(event: BurnOnLiquidationEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleInterestRedirectionAllowanceChanged(
  event: InterestRedirectionAllowanceChangedEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleInterestStreamRedirected(
  event: InterestStreamRedirectedEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleMintOnDeposit(event: MintOnDepositEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleRedeem(event: RedeemEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleRedirectedBalanceUpdated(
  event: RedirectedBalanceUpdatedEvent
): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}

export function handleTransfer(event: TransferEvent): void {
  handleToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    // todo
  );
}
