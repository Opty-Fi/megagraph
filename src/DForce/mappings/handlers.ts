import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { DForceToken as DTokenContract } from "../../../generated/DForceTokendDAI/DForceToken";
import { DForceStakingVault as DForceStakingVaultContract } from "../../../generated/DForceStakingVaultDAI/DForceStakingVault";
import { DForceTokenData } from "../../../generated/schema";
import {
  convertBINumToDesiredDecimals,
  toAddress,
  convertToLowerCase,
} from "../../utils/converters";
import {
  DForce_dDAI,
  DForce_dDAI_Staking,
  DForce_dUSDC,
  DForce_dUSDC_Staking,
  DForce_dUSDT,
  DForce_dUSDT_Staking,
} from "../../utils/constants";

export function handleDTokenEntity(
  dTokenAddress: Address,
  dforceStakingVaultAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  if (dTokenAddress == null) {
    if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase(DForce_dDAI_Staking)
    ) {
      dTokenAddress = toAddress(DForce_dDAI); //  dDAI
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      );
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase(DForce_dUSDC_Staking)
    ) {
      dTokenAddress = toAddress(DForce_dUSDC); //  dUSDC
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      );
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase(DForce_dUSDT_Staking)
    ) {
      dTokenAddress = toAddress(DForce_dUSDT); //  dUSDT
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      );
    }
  } else {
    if (dforceStakingVaultAddress == null) {
      if (convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(DForce_dDAI)) {
        dforceStakingVaultAddress = toAddress(DForce_dDAI_Staking); // DAI_Staking_Vault
        log.info("dDAI Staking Vault contract address: {}", [ dforceStakingVaultAddress.toHex() ]);
      } else if (convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(DForce_dUSDC)) {
        dforceStakingVaultAddress = toAddress(DForce_dUSDC_Staking); //  USDC_Staking_Vault
        log.info("dUSDC Staking Vault contract address: {}", [ dforceStakingVaultAddress.toHex() ]);
      } else if (convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(DForce_dUSDT)) {
        dforceStakingVaultAddress = toAddress(DForce_dUSDT_Staking); //  USDT_Staking_Vault
        log.info("dUSDT Staking Vault contract address: {}", [ dforceStakingVaultAddress.toHex() ]);
      }
    }
    createDTokenData(
      dTokenAddress,
      dforceStakingVaultAddress,
      transactionHash,
      blockNumber,
      blockTimestamp,
    );
  }
}

function createDTokenData(
  dTokenAddress: Address,
  dforceStakingVaultAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let dTokenContract = DTokenContract.bind(dTokenAddress);

  // Load DForceTokenData Entity for not having duplicates
  let dTokenDataEntity = DForceTokenData.load(transactionHash.toHex());
  if (dTokenDataEntity == null) {
    dTokenDataEntity = new DForceTokenData(transactionHash.toHex());
  }

  dTokenDataEntity.blockNumber = blockNumber;
  dTokenDataEntity.blockTimestamp = blockTimestamp;
  dTokenDataEntity.dTokenAddress = dTokenAddress;
  dTokenDataEntity.dTokenSymbol = dTokenContract.try_symbol().reverted
    ? null
    : dTokenContract.symbol();
  log.info("dToken address: {} and symbol: {}", [
    dTokenDataEntity.dTokenAddress.toHex(),
    dTokenDataEntity.dTokenSymbol.toString()
  ]);

  dTokenDataEntity.pricePerFullShare = dTokenContract.try_getExchangeRate().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getExchangeRate(), 18);
  dTokenDataEntity.balance = dTokenContract.try_getTotalBalance().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getTotalBalance(), 18);

  if (dforceStakingVaultAddress) {
    let dforceStakingVaultContract = DForceStakingVaultContract.bind(dforceStakingVaultAddress);

    dTokenDataEntity.rewardRate = dforceStakingVaultContract.try_rewardRate().reverted
      ? null
      : dforceStakingVaultContract.rewardRate();
  }

  log.info(
    "Saving data for dToken: {} - {} for block: {} with transaction hash: {}",
    [
      dTokenDataEntity.dTokenAddress.toHex(),
      dTokenDataEntity.dTokenSymbol,
      dTokenDataEntity.blockNumber.toString(),
      dTokenDataEntity.id,
    ],
  );
  dTokenDataEntity.save();
}
