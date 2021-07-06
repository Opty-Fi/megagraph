import {
  Interest as InterestEvent,
  Mint as MintEvent,
  NewDispatcher as NewDispatcherEvent,
  Rebalance as RebalanceEvent,
  Redeem as RedeemEvent,
  Transfer as TransferEvent,
  TransferFee as TransferFeeEvent,
} from '../../generated/dToken/dToken'
import { handleDTokenEntity } from './helpers'

export function handleTransfer(event: TransferEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleInterest(event: InterestEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMint(event: MintEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewDispatcher(event: NewDispatcherEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRebalance(event: RebalanceEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRedeem(event: RedeemEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleTransferFee(event: TransferFeeEvent): void {
  handleDTokenEntity(
    event.address,
    null,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}
