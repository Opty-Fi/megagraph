import { BigInt, log, Bytes, Address } from '@graphprotocol/graph-ts'
import {
  dToken as DTokenContract,
  Interest as InterestEvent,
  Mint as MintEvent,
  NewDispatcher as NewDispatcherEvent,
  Rebalance as RebalanceEvent,
  Redeem as RedeemEvent,
  Transfer as TransferEvent,
  TransferFee as TransferFeeEvent
} from '../generated/dToken/dToken'
import {
  DToken
} from '../generated/schema'

function handleEntity(
  dTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let dTokenEntity = DToken.load(
    transactionHash.toHex().concat('-').concat(blockNumber.toString()),
  )
  if (dTokenEntity == null) {
    dTokenEntity = new DToken(
      transactionHash.toHex().concat('-').concat(blockNumber.toString()),
    )
  }

  log.info('Contract Address from event: {}', [dTokenAddress.toHex()])
  let dTokenContract = DTokenContract.bind(dTokenAddress)
  log.info('dToken contract address: {}', [dTokenContract._address.toHex()])
  dTokenEntity.blockNumber = blockNumber
  dTokenEntity.blockTimestamp = BigInt.fromI32(blockTimestamp.toI32())
  dTokenEntity.pricePerFullShare = dTokenContract
    .getExchangeRate()
    .toBigDecimal()
  dTokenEntity.balance = dTokenContract.getTotalBalance().toBigDecimal()
  dTokenEntity.dTokenSymbol = dTokenContract.symbol()
  dTokenEntity.dTokenAddress = dTokenAddress

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

