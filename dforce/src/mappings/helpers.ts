import { BigInt, log, Bytes, Address, JSONValue } from '@graphprotocol/graph-ts'
import { dToken as DTokenContract } from '../../generated/dToken/dToken'
import { DForce_Staking_Vault as DForceStakingVaultContract } from '../../generated/DAI_Staking_Vault/DForce_Staking_Vault'
import { DTokenData } from '../../generated/schema'
import {
  convertBINumToDesiredDecimals,
  convertStringToAddress,
  convertToLowerCase,
} from '../../../src/utils/converters'
import {
  dDAI,
  dDAI_Staking,
  dUSDC,
  dUSDC_Staking,
  dUSDT,
  dUSDT_Staking,
} from './constants'

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
      convertToLowerCase(dDAI_Staking)
    ) {
      dTokenAddress = convertStringToAddress(dDAI) //  dDAI
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase(dUSDC_Staking)
    ) {
      dTokenAddress = convertStringToAddress(dUSDC) //  dUSDC
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase(dUSDT_Staking)
    ) {
      dTokenAddress = convertStringToAddress(dUSDT) //  dUSDT
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    }
  } else {
    if (dforceStakingVaultAddress == null) {
      if (
        convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(dDAI)
      ) {
        dforceStakingVaultAddress = convertStringToAddress(dDAI_Staking) // DAI_Staking_Vault
        log.info('dDAI Staking Vault contract address: {}', [dforceStakingVaultAddress.toHex()])
      } else if (
        convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(dUSDC)
      ) {
        dforceStakingVaultAddress = convertStringToAddress(dUSDC_Staking) //  USDC_Staking_Vault
        log.info('dUSDC Staking Vault contract address: {}', [dforceStakingVaultAddress.toHex()])
      } else if (
        convertToLowerCase(dTokenAddress.toHex()) == convertToLowerCase(dUSDT)
      ) {
        dforceStakingVaultAddress = convertStringToAddress(dUSDT_Staking) //  USDT_Staking_Vault
        log.info('dUSDT Staking Vault contract address: {}', [dforceStakingVaultAddress.toHex()])
      }
    }
    createDTokenData(
      dTokenAddress,
      dforceStakingVaultAddress,
      transactionHash,
      blockNumber,
      blockTimestamp,
    )
  }
}

function createDTokenData(
  dTokenAddress: Address,
  dforceStakingVaultAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let dTokenContract = DTokenContract.bind(dTokenAddress)

  // Load DTokenData Entity for not having duplicates
  let dTokenDataEntity = DTokenData.load(transactionHash.toHex())
  if (dTokenDataEntity == null) {
    dTokenDataEntity = new DTokenData(transactionHash.toHex())
  }

  dTokenDataEntity.blockNumber = blockNumber
  dTokenDataEntity.blockTimestamp = blockTimestamp
  dTokenDataEntity.dTokenAddress = dTokenAddress
  dTokenDataEntity.dTokenSymbol = dTokenContract.try_symbol().reverted
    ? null
    : dTokenContract.symbol()
  log.info('dToken address: {} and symbol: {}', [dTokenDataEntity.dTokenAddress.toHex(), dTokenDataEntity.dTokenSymbol.toString()])

  dTokenDataEntity.pricePerFullShare = dTokenContract.try_getExchangeRate()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getExchangeRate(), 18)
  dTokenDataEntity.balance = dTokenContract.try_getTotalBalance().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getTotalBalance(), 18)

  if (dforceStakingVaultAddress) {
    let dforceStakingVaultContract = DForceStakingVaultContract.bind(
      dforceStakingVaultAddress,
    )

    dTokenDataEntity.rewardRate = dforceStakingVaultContract.try_rewardRate()
      .reverted
      ? null
      : dforceStakingVaultContract.rewardRate()
  }

  log.info(
    'Saving data for dToken: {} - {} for block: {} with transaction hash: {}',
    [
      dTokenDataEntity.dTokenAddress.toHex(),
      dTokenDataEntity.dTokenSymbol,
      dTokenDataEntity.blockNumber.toString(),
      dTokenDataEntity.id,
    ],
  )
  dTokenDataEntity.save()
}
