import { BigInt, log, Address, Bytes } from '@graphprotocol/graph-ts'
import {
  CompSpeedUpdated as CompSpeedUpdatedEvent,
  ComptrollerImplementation,
} from '../../generated/Comptroller/ComptrollerImplementation'
import { CompSpeedUpdated } from '../../generated/schema'

//  Function to add/update the CompSpeedUpdated Entity
function handleEntity(
  comptrollerAddress: Address,
  cTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  log.info('Started saving data in CompSpeedUpdated Entity', [])
  let comptrollerContract = ComptrollerImplementation.bind(comptrollerAddress)
  let compSpeedUpdatedEntity = new CompSpeedUpdated(
    transactionHash.toHex().concat('-').concat(blockNumber.toString()),
  )
  compSpeedUpdatedEntity.cToken = cTokenAddress
  compSpeedUpdatedEntity.compSpeed = comptrollerContract.compSpeeds(
    cTokenAddress,
  )
  compSpeedUpdatedEntity.blockNumber = blockNumber
  compSpeedUpdatedEntity.blockTimestamp = blockTimestamp
  // linking cTokenData with the compSpeed entity to get the compSpeed
  compSpeedUpdatedEntity.cTokenData = transactionHash
    .toHex()
    .concat('-')
    .concat(blockNumber.toString())
  compSpeedUpdatedEntity.save()
}

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  log.info('Comptroller address in event call: {}', [event.address.toHex()])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleDistributedBorrowerComp(
  event: CompSpeedUpdatedEvent,
): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleDistributedSupplierComp(
  event: CompSpeedUpdatedEvent,
): void {
  log.info('listening DistSupp event - comptroller addr: ', [
    event.address.toHex(),
  ])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketEntered(event: CompSpeedUpdatedEvent): void {
  log.info('listening handle market entered event', [])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketExited(event: CompSpeedUpdatedEvent): void {
  log.info('listening handle market existed event', [])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketListed(event: CompSpeedUpdatedEvent): void {
  log.info('listening handle market listed event', [])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewBorrowCap(event: CompSpeedUpdatedEvent): void {
  log.info('listening handle new borrow cap event', [])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewCollateralFactor(event: CompSpeedUpdatedEvent): void {
  log.info('listeing handle new collateral factor event', [])
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}
