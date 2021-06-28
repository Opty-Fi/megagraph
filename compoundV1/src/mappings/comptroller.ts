import { BigInt, Address, Bytes } from '@graphprotocol/graph-ts'
import {
  CompSpeedUpdated as CompSpeedUpdatedEvent,
  ComptrollerImplementation,
} from '../../generated/Comptroller/ComptrollerImplementation'
import { CompSpeedUpdated } from '../../generated/schema'
import { convertBINumToDesiredDecimals } from '../../../src/utils/converters'

//  Function to add/update the CompSpeedUpdated Entity
function handleEntity(
  comptrollerAddress: Address,
  cTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let comptrollerContract = ComptrollerImplementation.bind(comptrollerAddress)
  let compSpeedUpdatedEntity = new CompSpeedUpdated(
    transactionHash.toHex().concat('-').concat(blockNumber.toString()),
  )
  compSpeedUpdatedEntity.cToken = cTokenAddress
  compSpeedUpdatedEntity.compSpeed = comptrollerContract.try_compSpeeds(
    cTokenAddress,
  ).reverted
    ? null
    : convertBINumToDesiredDecimals(
        comptrollerContract.compSpeeds(cTokenAddress),
        18,
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
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketEntered(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketExited(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMarketListed(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewBorrowCap(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewCollateralFactor(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.address,
    event.params.cToken,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}
