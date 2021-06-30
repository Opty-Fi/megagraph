import { BigInt, Address, log, Bytes } from '@graphprotocol/graph-ts'
import {
  CToken,
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  NewReserveFactor as NewReserveFactorEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
  Transfer as TransferEvent,
} from '../../generated/CToken/CToken'
import { ComptrollerImplementation } from '../../generated/Comptroller/ComptrollerImplementation'
import { CTokenData } from '../../generated/schema'
import {
  convertBINumToDesiredDecimals,
  convertToLowerCase,
} from '../../../src/utils/converters'

//  Function to add/update the cToken Entity
function handleEntity(
  cTokenAddress: Address,
  transactionHash: Bytes,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let cTokenDataEntity = CTokenData.load(
    transactionHash.toHex() + '-' + blockNumber.toString(),
  )
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CTokenData(
      transactionHash.toHex() + '-' + blockNumber.toString(),
    )
  }
  let cTokenContract = CToken.bind(cTokenAddress)
  let underlyingTokenAddress = cTokenContract.try_underlying()
  let underlyingTokenDecimals = null
  if (!underlyingTokenAddress.reverted) {
    let underlyingTokenContract = CToken.bind(underlyingTokenAddress.value)
    underlyingTokenDecimals = underlyingTokenContract.decimals()
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
  
  log.info('Comptroller in ctoken file', [])
  let comptrollerAddress = cTokenContract.try_comptroller()

  if (!comptrollerAddress.reverted) {
    let comptrollerContract = ComptrollerImplementation.bind(
      comptrollerAddress.value,
    )
    log.info('_comptroller address: {}', [comptrollerContract._address.toHex()])
    cTokenDataEntity.compSpeed = comptrollerContract.try_compSpeeds(
      cTokenAddress,
    ).reverted
      ? null
      : convertBINumToDesiredDecimals(
          comptrollerContract.compSpeeds(cTokenAddress),
          18,
        )
    log.info('Comp speed in cToken file: {}', [
      cTokenDataEntity.compSpeed.toString(),
    ])
  }
  cTokenDataEntity.save()
}

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.params.borrowIndex,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleBorrow(event: BorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleMint(event: MintEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}
