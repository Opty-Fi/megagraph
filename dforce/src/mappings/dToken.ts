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
import { DTokenData } from '../../generated/schema'
import { convertBINumToDesiredDecimals } from '../../../src/utils/converters'

function handleEntity(
  dTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let dTokenContract = DTokenContract.bind(dTokenAddress)

  // Load DTokenData Entity for not having duplicates
  let dTokenDataEntity = DTokenData.load(transactionHash.toHex())
  if (dTokenDataEntity == null) {
    dTokenDataEntity = new DTokenData(transactionHash.toHex())
  }

  dTokenDataEntity.blockNumber = blockNumber
  dTokenDataEntity.blockTimestamp = blockTimestamp
  dTokenDataEntity.dTokenAddress = dTokenAddress
  dTokenDataEntity.dTokenSymbol = dTokenContract.try_symbol().reverted
    ? null
    : dTokenContract.symbol()

  dTokenDataEntity.pricePerFullShare = dTokenContract.try_getExchangeRate()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getExchangeRate(), 18)
  dTokenDataEntity.balance = dTokenContract.try_getTotalBalance().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getTotalBalance(), 18)

  log.info(
    'Saving data for cToken: {} - {} for block: {} with transaction hash: {}',
    [
      dTokenDataEntity.dTokenAddress.toHex(),
      dTokenDataEntity.dTokenSymbol,
      dTokenDataEntity.blockNumber.toString(),
      dTokenDataEntity.id,
    ],
  )
  dTokenDataEntity.save()
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
