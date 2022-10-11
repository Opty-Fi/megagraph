import { BigInt, Address, log, Bytes } from "@graphprotocol/graph-ts";
import { CompoundToken } from "../../../generated/CompoundTokencDAI/CompoundToken";
import { CompoundComptrollerImplementation } from "../../../generated/CompoundTokencDAI/CompoundComptrollerImplementation";
import { CompoundComptrollerImplementationV2 } from "../../../generated/CompoundTokencDAI/CompoundComptrollerImplementationV2";
import { CompoundUnderlying } from "../../../generated/CompoundTokencDAI/CompoundUnderlying";
import { CompoundTokenData } from "../../../generated/schema";
import { ZERO_ADDRESS, ZERO_BI } from "../../utils/constants";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

//  Function to add/update the cToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  comptrollerAddress: Address | null,
  newBorrowSpeed: BigInt | null,
  newSupplySpeed: BigInt | null,
  cTokenAddress: Address,
  borrowIndex: BigInt | null,
  totalBorrows: BigInt | null,
): void {
  let cTokenContract = CompoundToken.bind(cTokenAddress);

  //  Get the underlying token decimals
  let underlyingTokenAddress = cTokenContract.try_underlying();
  let underlyingTokenDecimals = 0;
  if (!underlyingTokenAddress.reverted) {
    let underlyingTokenContract = CompoundUnderlying.bind(underlyingTokenAddress.value);
    underlyingTokenDecimals = underlyingTokenContract.decimals();
  }

  //  Load CTokenData Entity for not having duplicates
  let cTokenDataEntity = CompoundTokenData.load(transactionHash.toHex());
  if (cTokenDataEntity === null) {
    cTokenDataEntity = new CompoundTokenData(transactionHash.toHex());
  }

  cTokenDataEntity.blockNumber = blockNumber;
  cTokenDataEntity.blockTimestamp = blockTimestamp;
  cTokenDataEntity.cTokenAddress = cTokenAddress;
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted ? "" : cTokenContract.symbol();
  cTokenDataEntity.cTokenSymbol = cTokenDataEntity.cTokenSymbol === null ? "" : cTokenDataEntity.cTokenSymbol;

  cTokenDataEntity.totalBorrows =
    totalBorrows === null
      ? cTokenContract.try_totalBorrows().reverted
        ? null
        : convertBINumToDesiredDecimals(
            cTokenContract.totalBorrows(),
            underlyingTokenDecimals === 0
              ? cTokenDataEntity.cTokenSymbol.toLowerCase() == "ceth"
                ? 18
                : cTokenDataEntity.cTokenSymbol.toLowerCase() == "crep"
                ? 18
                : 0
              : underlyingTokenDecimals,
          )
      : convertBINumToDesiredDecimals(
          totalBorrows,
          underlyingTokenDecimals === 0
            ? cTokenDataEntity.cTokenSymbol.toLowerCase() == "ceth"
              ? 18
              : cTokenDataEntity.cTokenSymbol.toLowerCase() == "crep"
              ? 18
              : 0
            : underlyingTokenDecimals,
        );

  cTokenDataEntity.borrowIndex =
    borrowIndex === null
      ? cTokenContract.try_borrowIndex().reverted
        ? null
        : convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18)
      : convertBINumToDesiredDecimals(borrowIndex, 18);

  cTokenDataEntity.totalCash = cTokenContract.try_getCash().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.getCash(),
        underlyingTokenDecimals === 0
          ? cTokenDataEntity.cTokenSymbol.toLowerCase() == "ceth"
            ? 18
            : cTokenDataEntity.cTokenSymbol.toLowerCase() == "crep"
            ? 18
            : 0
          : underlyingTokenDecimals,
      );

  cTokenDataEntity.exchangeRate = cTokenContract.try_exchangeRateStored().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.exchangeRateStored(),
        underlyingTokenDecimals === 0
          ? cTokenDataEntity.cTokenSymbol.toLowerCase() == "ceth"
            ? 18 + 10
            : cTokenDataEntity.cTokenSymbol.toLowerCase() == "crep"
            ? 18 + 10
            : 0
          : underlyingTokenDecimals + 10,
      );

  cTokenDataEntity.borrowRatePerBlock = cTokenContract.try_borrowRatePerBlock().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.borrowRatePerBlock(), 18);
  cTokenDataEntity.totalReserves = cTokenContract.try_totalReserves().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.totalReserves(), 18);
  cTokenDataEntity.totalSupply = cTokenContract.try_totalSupply().reverted ? null : cTokenContract.totalSupply();
  cTokenDataEntity.supplyRatePerBlock = cTokenContract.try_supplyRatePerBlock().reverted
    ? null
    : convertBINumToDesiredDecimals(cTokenContract.supplyRatePerBlock(), 18);

  comptrollerAddress =
    comptrollerAddress === null
      ? cTokenContract.try_comptroller().reverted
        ? ZERO_ADDRESS
        : cTokenContract.comptroller()
      : comptrollerAddress;
  if (comptrollerAddress) {
    // https://compound.finance/governance/proposals/62
    // split compSpeeds into compBorrowSpeeds and compSupplySpeeds
    if (blockNumber.ge(BigInt.fromI32(13322798))) {
      let comptrollerContract = CompoundComptrollerImplementationV2.bind(comptrollerAddress);
      cTokenDataEntity.compBorrowSpeed = convertBINumToDesiredDecimals(
        newBorrowSpeed
          ? newBorrowSpeed
          : comptrollerContract.try_compBorrowSpeeds(cTokenAddress).reverted
          ? ZERO_BI
          : comptrollerContract.compBorrowSpeeds(cTokenAddress),
        18,
      );
      cTokenDataEntity.compSupplySpeed = convertBINumToDesiredDecimals(
        newSupplySpeed
          ? newSupplySpeed
          : comptrollerContract.try_compSupplySpeeds(cTokenAddress).reverted
          ? ZERO_BI
          : comptrollerContract.compSupplySpeeds(cTokenAddress),
        18,
      );
    } else {
      let comptrollerContract = CompoundComptrollerImplementation.bind(comptrollerAddress);
      cTokenDataEntity.compBorrowSpeed = convertBINumToDesiredDecimals(
        newBorrowSpeed
          ? newBorrowSpeed
          : comptrollerContract.try_compSpeeds(cTokenAddress).reverted
          ? ZERO_BI
          : comptrollerContract.compSpeeds(cTokenAddress),
        18,
      );
      cTokenDataEntity.compSupplySpeed = convertBINumToDesiredDecimals(
        newSupplySpeed
          ? newSupplySpeed
          : comptrollerContract.try_compSpeeds(cTokenAddress).reverted
          ? ZERO_BI
          : comptrollerContract.compSpeeds(cTokenAddress),
        18,
      );
    }
  }
  log.info("Saving data for cToken: {} - {} for block: {} with transaction hash: {}", [
    cTokenDataEntity.cTokenAddress.toHex(),
    cTokenDataEntity.cTokenSymbol,
    cTokenDataEntity.blockNumber.toString(),
    cTokenDataEntity.id,
  ]);
  cTokenDataEntity.save();
}
