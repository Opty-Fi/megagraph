import { BigInt, log, Bytes, Address } from "@graphprotocol/graph-ts";
import { DForceToken as DTokenContract } from "../../../generated/DForceTokendDAI/DForceToken";
import { DForceStakingVault as DForceStakingVaultContract } from "../../../generated/DForceTokendDAI/DForceStakingVault";
import { DForceTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import {
  DForce_dDAI,
  DForce_dDAI_Staking,
  DForce_dUSDC,
  DForce_dUSDC_Staking,
  DForce_dUSDT,
  DForce_dUSDT_Staking,
  ZERO_ADDRESS,
} from "../../utils/constants";

export function handleDTokenEntity(
  dTokenAddress: Address | null,
  dforceStakingVaultAddress: Address | null,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  dforceStakingVaultAddress = !dforceStakingVaultAddress ? ZERO_ADDRESS : dforceStakingVaultAddress;
  if (dTokenAddress === null) {
    if (dforceStakingVaultAddress.toHex().toLowerCase() == DForce_dDAI_Staking.toHex().toLowerCase()) {
      dTokenAddress = DForce_dDAI;
      createDTokenData(dTokenAddress, dforceStakingVaultAddress, transactionHash, blockNumber, blockTimestamp);
    } else if (dforceStakingVaultAddress.toHex().toLowerCase() == DForce_dUSDC_Staking.toHex().toLowerCase()) {
      dTokenAddress = DForce_dUSDC;
      createDTokenData(dTokenAddress, dforceStakingVaultAddress, transactionHash, blockNumber, blockTimestamp);
    } else if (dforceStakingVaultAddress.toHex().toLowerCase() == DForce_dUSDT_Staking.toHex().toLowerCase()) {
      dTokenAddress = DForce_dUSDT;
      createDTokenData(dTokenAddress, dforceStakingVaultAddress, transactionHash, blockNumber, blockTimestamp);
    }
  } else {
    if (dforceStakingVaultAddress === null) {
      if (dTokenAddress.toHex().toLowerCase() == DForce_dDAI.toHex().toLowerCase()) {
        dforceStakingVaultAddress = DForce_dDAI_Staking;
        log.info("dDAI Staking Vault contract address: {}", [dforceStakingVaultAddress.toHex()]);
      } else if (dTokenAddress.toHex().toLowerCase() == DForce_dUSDC.toHex().toLowerCase()) {
        dforceStakingVaultAddress = DForce_dUSDC_Staking;
        log.info("dUSDC Staking Vault contract address: {}", [dforceStakingVaultAddress.toHex()]);
      } else if (dTokenAddress.toHex().toLowerCase() == DForce_dUSDT.toHex().toLowerCase()) {
        dforceStakingVaultAddress = DForce_dUSDT_Staking;
        log.info("dUSDT Staking Vault contract address: {}", [dforceStakingVaultAddress.toHex()]);
      }
    }
    createDTokenData(dTokenAddress, dforceStakingVaultAddress, transactionHash, blockNumber, blockTimestamp);
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

  // Load DTokenData Entity for not having duplicates
  let dTokenDataEntity = DForceTokenData.load(transactionHash.toHex());
  if (dTokenDataEntity === null) {
    dTokenDataEntity = new DForceTokenData(transactionHash.toHex());
  }

  dTokenDataEntity.blockNumber = blockNumber;
  dTokenDataEntity.blockTimestamp = blockTimestamp;
  dTokenDataEntity.dTokenAddress = dTokenAddress;
  dTokenDataEntity.dTokenSymbol = dTokenContract.try_symbol().reverted ? "" : dTokenContract.symbol();
  log.info("dToken address: {} and symbol: {}", [
    dTokenContract._address.toHex(),
    dTokenDataEntity.dTokenSymbol.toString(),
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

  log.info("Saving data for dToken: {} - {} for block: {} with transaction hash: {}", [
    dTokenDataEntity.dTokenAddress.toHex(),
    dTokenDataEntity.dTokenSymbol,
    dTokenDataEntity.blockNumber.toString(),
    dTokenDataEntity.id,
  ]);
  dTokenDataEntity.save();
}
