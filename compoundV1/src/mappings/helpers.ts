import { BigInt, Address, log, Bytes } from '@graphprotocol/graph-ts'
import { CToken } from '../../generated/CToken/CToken'
import { ComptrollerImplementation } from '../../generated/Comptroller/ComptrollerImplementation'
import { CTokenData } from '../../generated/schema'
import {
  convertBINumToDesiredDecimals,
  convertToLowerCase,
} from '../../../src/utils/converters'

//  Function to add/update the cToken Entity
export function createCTokenEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  cTokenAddress: Address,
  comptrollerAddress: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
): void {
  let cTokenContract = CToken.bind(cTokenAddress)

  let underlyingTokenAddress = cTokenContract.try_underlying()
  let underlyingTokenDecimals = null
  if (!underlyingTokenAddress.reverted) {
    let underlyingTokenContract = CToken.bind(underlyingTokenAddress.value)
    underlyingTokenDecimals = underlyingTokenContract.decimals()
  }

  let cTokenDataEntity = CTokenData.load(transactionHash.toHex())
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CTokenData(transactionHash.toHex())
  }

  cTokenDataEntity.blockNumber = blockNumber
  cTokenDataEntity.blockTimestamp = blockTimestamp
  cTokenDataEntity.cTokenAddress = cTokenAddress
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted
    ? null
    : cTokenContract.symbol()

  cTokenDataEntity.totalBorrows =
    totalBorrows == null
      ? cTokenContract.try_totalBorrows().reverted
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
      : convertBINumToDesiredDecimals(
          totalBorrows,
          underlyingTokenDecimals == null
            ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'ceth'
              ? 18
              : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == 'crep'
              ? 18
              : 0
            : underlyingTokenDecimals,
        )

  cTokenDataEntity.borrowIndex =
    borrowIndex == null
      ? cTokenContract.try_borrowIndex().reverted
        ? null
        : convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18)
      : convertBINumToDesiredDecimals(borrowIndex, 18)

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

  comptrollerAddress =
    comptrollerAddress == null
      ? cTokenContract.try_comptroller().reverted
        ? null
        : cTokenContract.comptroller()
      : comptrollerAddress

  if (comptrollerAddress) {
    let comptrollerContract = ComptrollerImplementation.bind(comptrollerAddress)
    cTokenDataEntity.compSpeed = comptrollerContract.try_compSpeeds(
      cTokenAddress,
    ).reverted
      ? null
      : convertBINumToDesiredDecimals(
          comptrollerContract.compSpeeds(cTokenAddress),
          18,
        )
  }
  cTokenDataEntity.save()
}
