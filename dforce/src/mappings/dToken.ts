import { BigInt, log, Bytes, Address } from '@graphprotocol/graph-ts'
import {
  dToken as DTokenContract,
  Interest as InterestEvent,
  Mint as MintEvent,
  NewDispatcher as NewDispatcherEvent,
  Rebalance as RebalanceEvent,
  Redeem as RedeemEvent,
  Transfer as TransferEvent,
  TransferFee as TransferFeeEvent,
} from '../../generated/dToken/dToken'
import { DToken } from '../../generated/schema'
import { convertBINumToDesiredDecimals } from '../../../src/utils/converters'

function handleEntity(
  dTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  log.info('Contract Address from event: {}', [dTokenAddress.toHex()])
  let dTokenContract = DTokenContract.bind(dTokenAddress)
  log.info('dToken contract address: {}', [dTokenContract._address.toHex()])

  let dTokenEntity = DToken.load(
    transactionHash.toHex().concat('-').concat(blockNumber.toString()),
  )
  if (dTokenEntity == null) {
    dTokenEntity = new DToken(
      transactionHash.toHex().concat('-').concat(blockNumber.toString()),
    )
  }

  dTokenEntity.blockNumber = blockNumber
  dTokenEntity.blockTimestamp = blockTimestamp
  dTokenEntity.dTokenAddress = dTokenAddress
  dTokenEntity.dTokenSymbol = dTokenContract.try_symbol().reverted
    ? null
    : dTokenContract.symbol()

  dTokenEntity.pricePerFullShare = dTokenContract.try_getExchangeRate().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getExchangeRate(), 18)
  dTokenEntity.balance = dTokenContract.try_getTotalBalance().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getTotalBalance(), 18)

  dTokenEntity.save()
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleInterest(event: InterestEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMint(event: MintEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewDispatcher(event: NewDispatcherEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRebalance(event: RebalanceEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleTransferFee(event: TransferFeeEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}
