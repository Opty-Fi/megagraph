import { log, Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { convertBINumToDesiredDecimals, exponentToBigDecimal } from "../../utils/converters";
import { TraderJoeLendingData } from "../../../generated/schema";
import { TraderJoeJToken } from "../../../generated/TraderJoeJTokenjAVAX/TraderJoeJToken";
import { TraderJoeERC20 } from "../../../generated/TraderJoeJTokenjAVAX/TraderJoeERC20";
import { TraderJoeJCollateralCapErc20 } from "../../../generated/TraderJoeJTokenjAVAX/TraderJoeJCollateralCapErc20";
import {
  AccrueInterest as AccrueInterestEvent,
  Borrow as BorrowEvent,
  LiquidateBorrow as LiquidateBorrowEvent,
  Mint as MintEvent,
  Redeem as RedeemEvent,
  RepayBorrow as RepayBorrowEvent,
  ReservesAdded as ReservesAddedEvent,
  ReservesReduced as ReservesReducedEvent,
  Flashloan as FlashloanEvent,
} from "../../../generated/TraderJoeJTokenjAVAX/TraderJoeJWrappedNative";

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.borrowIndex,
    event.params.totalBorrows,
    null, // totalReserves
  );
}
export function handleBorrow(event: BorrowEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}
export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}
export function handleMint(event: MintEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}
export function handleRedeem(event: RedeemEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}
export function handleRepayBorrow(event: RepayBorrowEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    event.params.totalBorrows,
    null, // totalReserves
  );
}
export function handleReservesAdded(event: ReservesAddedEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}
export function handleReservesReduced(event: ReservesReducedEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    event.params.newTotalReserves,
  );
}
export function handleFlashloan(event: FlashloanEvent): void {
  handleLendingEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
}
function handleLendingEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
  totalReserves: BigInt,
): void {
  let tokenContract = TraderJoeJToken.bind(address);

  let entity = TraderJoeLendingData.load(transactionHash.toHex());
  if (!entity) entity = new TraderJoeLendingData(transactionHash.toHex());

  let mantissaFactor = 18;
  let mantissaFactorBD: BigDecimal = exponentToBigDecimal(18);
  let jTokenDecimalsBD: BigDecimal = exponentToBigDecimal(8);
  let jTokenDecimals = 8;

  // @ts-ignore
  let underlyingAssetDecimals: i32;

  let jCollateralContract = TraderJoeJCollateralCapErc20.bind(address);
  let underlyingAddressResult = jCollateralContract.try_underlying();
  if (underlyingAddressResult.reverted) {
    log.warning("try_underlying() reverted", []);
  } else {
    let assetContractAddress = underlyingAddressResult.value;
    let underlyingContract = TraderJoeERC20.bind(assetContractAddress as Address);
    let underlyingDecimalsResult = underlyingContract.try_decimals();
    if (underlyingDecimalsResult.reverted) {
      log.warning("try_decimals() reverted on {}", [assetContractAddress.toHex()]);
      return;
    } else {
      underlyingAssetDecimals = underlyingDecimalsResult.value;
    }
    let underlyingSymbolResult = underlyingContract.try_symbol();
    if (underlyingSymbolResult.reverted) {
      log.warning("try_symbol() on {}", [assetContractAddress.toHex()]);
    } else {
      entity.underlyingSymbol = underlyingSymbolResult.value;
    }

    entity.underlyingAddress = assetContractAddress;
  }

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;

  let symbolResult = tokenContract.try_symbol();
  if (symbolResult.reverted) {
    entity.symbol = null;
    log.warning("try_symbol() reverted", []);
  } else {
    entity.symbol = symbolResult.value;
  }

  if (borrowIndex) {
    entity.borrowIndex = convertBINumToDesiredDecimals(borrowIndex, mantissaFactor).truncate(mantissaFactor);
  } else {
    let borrowIndexResult = tokenContract.try_borrowIndex();
    if (borrowIndexResult.reverted) {
      log.error("borrowIndex() reverted", []);
    } else
      entity.borrowIndex = convertBINumToDesiredDecimals(borrowIndexResult.value, mantissaFactor).truncate(
        mantissaFactor,
      );
  }

  let borrowRatePerSecondResult = tokenContract.try_borrowRatePerSecond();
  if (borrowRatePerSecondResult.reverted) {
    log.error("borrowRatePerSecond() reverted", []);
  } else
    entity.borrowRatePerSecond = convertBINumToDesiredDecimals(
      borrowRatePerSecondResult.value,
      mantissaFactor,
    ).truncate(mantissaFactor);

  let supplyRatePResulterSecond = tokenContract.try_supplyRatePerSecond();
  if (supplyRatePResulterSecond.reverted) {
    log.error("supplyRatePerSecond() reverted", []);
  } else
    entity.supplyRatePerSecond = convertBINumToDesiredDecimals(
      supplyRatePResulterSecond.value,
      mantissaFactor,
    ).truncate(mantissaFactor);

  let exchangeRateResultStored = tokenContract.try_exchangeRateStored();
  if (exchangeRateResultStored.reverted) log.error("exchangeRateStored() reverted", []);
  else {
    entity.exchangeRateStored = convertBINumToDesiredDecimals(exchangeRateResultStored.value, underlyingAssetDecimals)
      .times(jTokenDecimalsBD)
      .div(mantissaFactorBD)
      .truncate(mantissaFactor);
  }

  let cashResult = tokenContract.try_getCash();

  if (cashResult.reverted) log.error("getCash() reverted", []);
  else
    entity.totalCash = convertBINumToDesiredDecimals(cashResult.value, underlyingAssetDecimals).truncate(
      underlyingAssetDecimals,
    );

  if (totalBorrows) {
    entity.totalBorrows = convertBINumToDesiredDecimals(totalBorrows, underlyingAssetDecimals).truncate(
      underlyingAssetDecimals,
    );
  } else {
    let totalBorrowResults = tokenContract.try_totalBorrows();
    if (totalBorrowResults.reverted) log.error("totalBorrows() reverted", []);
    else
      entity.totalBorrows = convertBINumToDesiredDecimals(totalBorrowResults.value, underlyingAssetDecimals).truncate(
        underlyingAssetDecimals,
      );
  }

  let totalSupplyResult = tokenContract.try_totalSupply();
  if (totalSupplyResult.reverted) log.error("totalSupply() reverted", []);
  else
    entity.totalSupply = convertBINumToDesiredDecimals(totalSupplyResult.value, jTokenDecimals).truncate(
      jTokenDecimals,
    );

  if (totalReserves) {
    entity.totalReserves = convertBINumToDesiredDecimals(totalReserves, underlyingAssetDecimals).truncate(
      underlyingAssetDecimals,
    );
  } else {
    let totalReservesResult = tokenContract.try_totalReserves();
    if (totalReservesResult.reverted) log.error("totalReserves() reverted", []);
    else
      entity.totalReserves = convertBINumToDesiredDecimals(totalReservesResult.value, underlyingAssetDecimals).truncate(
        underlyingAssetDecimals,
      );
  }

  entity.save();
}
