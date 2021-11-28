import { BigInt, Address, log, Bytes } from "@graphprotocol/graph-ts";
import { CompoundToken } from "../../../generated/CompoundTokencDAI/CompoundToken";
import { CompoundComptrollerImplementation } from "../../../generated/CompoundTokencDAI/CompoundComptrollerImplementation";
import { CompoundUnderlying } from "../../../generated/CompoundTokencDAI/CompoundUnderlying";
import { CompoundTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertToLowerCase } from "../../utils/converters";

//  Function to add/update the cToken Entity
export function handleEntity(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  comptrollerAddress: Address,
  newSpeed: BigInt,
  cTokenAddress: Address,
  borrowIndex: BigInt,
  totalBorrows: BigInt,
): void {
  let cTokenContract = CompoundToken.bind(cTokenAddress);

  //  Get the underlying token decimals
  let underlyingTokenAddress = cTokenContract.try_underlying();
  let underlyingTokenDecimals = null;
  if (!underlyingTokenAddress.reverted) {
    let underlyingTokenContract = CompoundUnderlying.bind(underlyingTokenAddress.value);
    underlyingTokenDecimals = underlyingTokenContract.decimals();
  }

  //  Load CTokenData Entity for not having duplicates
  let cTokenDataEntity = CompoundTokenData.load(transactionHash.toHex());
  if (cTokenDataEntity == null) {
    cTokenDataEntity = new CompoundTokenData(transactionHash.toHex());
  }

  cTokenDataEntity.blockNumber = blockNumber;
  cTokenDataEntity.blockTimestamp = blockTimestamp;
  cTokenDataEntity.cTokenAddress = cTokenAddress;
  cTokenDataEntity.cTokenSymbol = cTokenContract.try_symbol().reverted ? null : cTokenContract.symbol();

  cTokenDataEntity.totalBorrows =
    totalBorrows == null
      ? cTokenContract.try_totalBorrows().reverted
        ? null
        : convertBINumToDesiredDecimals(
            cTokenContract.totalBorrows(),
            underlyingTokenDecimals == null
              ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "ceth"
                ? 18
                : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "crep"
                ? 18
                : 0
              : underlyingTokenDecimals,
          )
      : convertBINumToDesiredDecimals(
          totalBorrows,
          underlyingTokenDecimals == null
            ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "ceth"
              ? 18
              : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "crep"
              ? 18
              : 0
            : underlyingTokenDecimals,
        );

  cTokenDataEntity.borrowIndex =
    borrowIndex == null
      ? cTokenContract.try_borrowIndex().reverted
        ? null
        : convertBINumToDesiredDecimals(cTokenContract.borrowIndex(), 18)
      : convertBINumToDesiredDecimals(borrowIndex, 18);

  cTokenDataEntity.totalCash = cTokenContract.try_getCash().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.getCash(),
        underlyingTokenDecimals == null
          ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "ceth"
            ? 18
            : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "crep"
            ? 18
            : 0
          : underlyingTokenDecimals,
      );

  cTokenDataEntity.exchangeRate = cTokenContract.try_exchangeRateStored().reverted
    ? null
    : convertBINumToDesiredDecimals(
        cTokenContract.exchangeRateStored(),
        underlyingTokenDecimals == null
          ? convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "ceth"
            ? 18 + 10
            : convertToLowerCase(cTokenDataEntity.cTokenSymbol) == "crep"
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
    comptrollerAddress == null
      ? cTokenContract.try_comptroller().reverted
        ? null
        : cTokenContract.comptroller()
      : comptrollerAddress;
  if (comptrollerAddress) {
    let comptrollerContract = CompoundComptrollerImplementation.bind(comptrollerAddress);
    cTokenDataEntity.compSpeed = convertBINumToDesiredDecimals(
      newSpeed
        ? newSpeed
        : comptrollerContract.try_compSpeeds(cTokenAddress).reverted
        ? null
        : comptrollerContract.compSpeeds(cTokenAddress),
      18,
    );
  }
  log.info("Saving data for cToken: {} - {} for block: {} with transaction hash: {}", [
    cTokenDataEntity.cTokenAddress.toHex(),
    cTokenDataEntity.cTokenSymbol,
    cTokenDataEntity.blockNumber.toString(),
    cTokenDataEntity.id,
  ]);
  cTokenDataEntity.save();
}
