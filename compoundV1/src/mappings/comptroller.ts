import { BigInt, Address, log, Bytes } from '@graphprotocol/graph-ts'
import {
  CompSpeedUpdated as CompSpeedUpdatedEvent,
  ComptrollerImplementation,
} from '../../generated/Comptroller/ComptrollerImplementation'
import { CToken } from '../../generated/CToken/CToken'
import { CTokenData } from '../../generated/schema'
import {
  convertBINumToDesiredDecimals,
  convertToLowerCase,
} from '../../../src/utils/converters'

//  Function to add/update the CompSpeedUpdated Entity
function handleEntity(
  comptrollerAddress: Address,
  cTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let comptrollerContract = ComptrollerImplementation.bind(comptrollerAddress)
  let cTokenContract = CToken.bind(cTokenAddress)

  let underlyingTokenAddress = cTokenContract.try_underlying()
  let underlyingTokenDecimals = null
  if (!underlyingTokenAddress.reverted) {
    let underlyingTokenContract = CToken.bind(underlyingTokenAddress.value)
    underlyingTokenDecimals = underlyingTokenContract.decimals()
  }

  let cTokenDataEntity = CTokenData.load(
    transactionHash.toHex() + '-' + blockNumber.toString(),
  )
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CTokenData(
      transactionHash.toHex() + '-' + blockNumber.toString(),
    )
  }

  cTokenDataEntity.blockNumber = blockNumber
  cTokenDataEntity.blockTimestamp = blockTimestamp
  cTokenDataEntity.cTokenAddress = cTokenAddress
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted
    ? null
    : cTokenContract.symbol()

  cTokenDataEntity.totalBorrows = cTokenContract.try_totalBorrows().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.totalBorrows(),
        underlyingTokenDecimals == null
          ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'ceth'
            ? 18
            : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'crep'
            ? 18
            : 0
          : underlyingTokenDecimals,
      )

  cTokenDataEntity.borrowIndex = cTokenContract.try_borrowIndex().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18)

  cTokenDataEntity.totalCash = cTokenContract.try_getCash().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.getCash(),
        underlyingTokenDecimals == null
          ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'ceth'
            ? 18
            : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'crep'
            ? 18
            : 0
          : underlyingTokenDecimals,
      )

  cTokenDataEntity.exchangeRate = cTokenContract.try_exchangeRateStored()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.exchangeRateStored(),
        underlyingTokenDecimals == null
          ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'ceth'
            ? 18 + 10
            : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'crep'
            ? 18 + 10
            : 0
          : underlyingTokenDecimals + 10,
      )

  cTokenDataEntity.borrowRatePerBlock = cTokenContract.try_borrowRatePerBlock()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.borrowRatePerBlock(), 18)
  cTokenDataEntity.totalReserves = cTokenContract.try_totalReserves().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.totalReserves(), 18)
  cTokenDataEntity.totalSupply = cTokenContract.try_totalSupply().reverted
    ? null
    : cTokenContract.totalSupply()
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.try_supplyRatePerBlock()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.supplyRatePerBlock(), 18)

  cTokenDataEntity.compSpeed = comptrollerContract.try_compSpeeds(cTokenAddress)
    .reverted
    ? null
    : convertBINumToDesiredDecimals(
        comptrollerContract.compSpeeds(cTokenAddress),
        18,
      )
  log.info('Comp speed in comptroller file: {}', [
    cTokenDataEntity.compSpeed.toString(),
  ])

  cTokenDataEntity.save()
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