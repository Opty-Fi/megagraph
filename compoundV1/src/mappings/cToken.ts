import { BigInt, log, Address, Bytes } from '@graphprotocol/graph-ts'
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
import { CompSpeedUpdated, CTokenData } from '../../generated/schema'
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
  compSpeed: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  log.info("coming in ctoken's handle entity..", [])
  let cTokenDataEntity = CTokenData.load(
    transactionHash.toHex() + '-' + blockNumber.toString(),
  )
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CTokenData(
      transactionHash.toHex() + '-' + blockNumber.toString(),
    )
  }
  let cTokenContract = CToken.bind(cTokenAddress)
  let cTokenDecimals = cTokenContract.try_decimals().reverted
    ? null
    : cTokenContract.decimals()
  let underlyingTokenAddress = cTokenContract.try_underlying()
  let underlyingTokenDecimals = null
  if (!underlyingTokenAddress.reverted) {
    log.info('Able to get the underlyingToken addr: {}', [
      underlyingTokenAddress.value.toHex(),
    ])
    let underlyingTokenContract = CToken.bind(underlyingTokenAddress.value)
    underlyingTokenDecimals = underlyingTokenContract.decimals()
    log.info('Underlying token Addr: {} has decimals: {}', [
      underlyingTokenAddress.value.toHex(),
      underlyingTokenDecimals.toString(),
    ])
  }
  log.info('Ctoken Addr: {} has decimals: {}', [
    cTokenAddress.toHex(),
    cTokenDecimals.toString(),
  ])
  cTokenDataEntity.blockNumber = blockNumber
  cTokenDataEntity.blockTimestamp = blockTimestamp
  cTokenDataEntity.cTokenAddress = cTokenAddress
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted
    ? null
    : cTokenContract.symbol()
  log.info('Logging symbol before saving: {}', [cTokenDataEntity.cTokenSymbol])
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

  log.info('Logging Ctoken data into IPFS in Ctoken file', [])
  cTokenDataEntity.save()

  //  ----- comptroller stuff ------- //
  // log.info("2nd stage for comptroller in ctoken file",[])
  // let comptrollerContract = ComptrollerImplementation.bind(comptrollerAddress)
  // log.info("_comptroller address: {}", [comptrollerContract._address.toHex()])
  // let compSpeedUpdatedEntity = new CompSpeedUpdated(
  //   transactionHash.toHex() + "-" + blockNumber.toString()
  // )
  // compSpeedUpdatedEntity.cToken = cTokenAddress
  // if (comptrollerContract.try_compSpeeds(cTokenAddress).reverted) {
  //   log.info("Reverted: true", [])
  // } else {
  //   log.info("Reverted: false", [])
  // }
  // comptrollerContract.try_compSpeeds(cTokenAddress).reverted
  // compSpeedUpdatedEntity.compSpeed = comptrollerContract.try_compSpeeds(cTokenAddress).value
  // log.info("CompSpeed in ctoken: {}", [comptrollerContract.compSpeeds(cTokenAddress).toString()])
  // compSpeedUpdatedEntity.blockNumber = blockNumber
  // compSpeedUpdatedEntity.blockTimestamp = blockTimestamp
  // compSpeedUpdatedEntity.comptrollerAddress = comptrollerAddress
  // compSpeedUpdatedEntity.save()
}

//  changing totalBorrows, borrowIndex, therefore capturing
export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.params.borrowIndex,
    event.params.totalBorrows,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  Chaging totalBorrows, therefore capturing
export function handleBorrow(event: BorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  calling accureInterest() internally in contract therefore, capturing
export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  Change of totalSupply variable, therefore catching
export function handleMint(event: MintEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

// calling accureInterest internally, therefore capturing {May be it can be skipped as
// it is being captured by accureInterest event}
export function handleNewReserveFactor(event: NewReserveFactorEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalSupply is getting changed
export function handleRedeem(event: RedeemEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalBorrows getting changed, therefore capturing
export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    event.params.totalBorrows,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalReserves getting changed, therefore capturing
export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalReserves getting changed
export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}

//  totalSupply getting changed
export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    null,
    null,
    null,
    event.block.number,
    event.block.timestamp,
  )
}
