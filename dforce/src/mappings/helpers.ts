import { BigInt, log, Bytes, Address } from '@graphprotocol/graph-ts'
import { dToken as DTokenContract } from '../../generated/dToken/dToken'
import { DForce_Staking_Vault as DForceStakingVaultContract } from '../../generated/DAI_Staking_Vault/DForce_Staking_Vault'
import { DTokenData } from '../../generated/schema'
import {
  convertBINumToDesiredDecimals,
  convertToLowerCase,
} from '../../../src/utils/converters'

export function handleDTokenEntity(
  dTokenAddress: Address,
  dforceStakingVaultAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  log.info('Dforce SV address at start: {}', [
    dforceStakingVaultAddress.toHex(),
  ])

  if (dTokenAddress == null) {
    log.info('Coming in block when dTokenAddress is null', [])
    if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase('0xD2fA07cD6Cd4A5A96aa86BacfA6E50bB3aaDBA8B')
    ) {
      dTokenAddress = Address.fromString(
        '0x02285AcaafEB533e03A7306C55EC031297df9224',
      ) //  dDAI
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase('0xB71dEFDd6240c45746EC58314a01dd6D833fD3b5')
    ) {
      dTokenAddress = Address.fromString(
        '0x16c9cF62d8daC4a38FB50Ae5fa5d51E9170F3179',
      ) //  dUSDC
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    } else if (
      convertToLowerCase(dforceStakingVaultAddress.toHex()) ==
      convertToLowerCase('0x324EebDAa45829c6A8eE903aFBc7B61AF48538df')
    ) {
      dTokenAddress = Address.fromString(
        '0x868277d475E0e475E38EC5CdA2d9C83B5E1D9fc8',
      ) //  dUSDT
      createDTokenData(
        dTokenAddress,
        dforceStakingVaultAddress,
        transactionHash,
        blockNumber,
        blockTimestamp,
      )
    }
  } else {
    log.info('Coming in block when dTokenAddress is NOT null', [])
    if (dforceStakingVaultAddress == null) {
      log.info('Coming in block when dforceStakingVaultAddress is null', [])
      if (
        convertToLowerCase(dTokenAddress.toHex()) ==
        convertToLowerCase('0x02285AcaafEB533e03A7306C55EC031297df9224')
      ) {
        dforceStakingVaultAddress = Address.fromString(
          '0xD2fA07cD6Cd4A5A96aa86BacfA6E50bB3aaDBA8B',
        ) // DAI_Staking_Vault
      } else if (
        convertToLowerCase(dTokenAddress.toHex()) ==
        convertToLowerCase('0x16c9cF62d8daC4a38FB50Ae5fa5d51E9170F3179')
      ) {
        dforceStakingVaultAddress = Address.fromString(
          '0xB71dEFDd6240c45746EC58314a01dd6D833fD3b5',
        ) //  USDC_Staking_Vault
      } else if (
        convertToLowerCase(dTokenAddress.toHex()) ==
        convertToLowerCase('0x868277d475E0e475E38EC5CdA2d9C83B5E1D9fc8')
      ) {
        dforceStakingVaultAddress = Address.fromString(
          '0x324EebDAa45829c6A8eE903aFBc7B61AF48538df',
        ) //  USDT_Staking_Vault
      }
    }
    log.info('Coming in block when dforceStakingVaultAddress is null', [])
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
  // dTokenAddress = dTokenAddress == null ? convertToLowerCase(dforceStakingVaultAddress.toHex()) == "0x324eebdaa45829c6a8ee903afbc7b61af48538df" ? Address.fromString("0x02285AcaafEB533e03A7306C55EC031297df9224") : convertToLowerCase(dforceStakingVaultAddress.toHex()) == convertToLowerCase("0xB71dEFDd6240c45746EC58314a01dd6D833fD3b5") ? Address.fromString("0x16c9cF62d8daC4a38FB50Ae5fa5d51E9170F3179") : null : dTokenAddress
  log.info('DToken address before everything: {}', [dTokenAddress.toHex()])
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

  dTokenDataEntity.pricePerFullShare = dTokenContract.try_getExchangeRate()
    .reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getExchangeRate(), 18)
  dTokenDataEntity.balance = dTokenContract.try_getTotalBalance().reverted
    ? null
    : convertBINumToDesiredDecimals(dTokenContract.getTotalBalance(), 18)

  log.info("dToken's Address from event: {}", [dTokenAddress.toHex()])
  log.info("dToken's Address from event using convertor: {}", [
    convertToLowerCase(dTokenAddress.toHex()),
  ])

  // dforceStakingVaultAddress = dforceStakingVaultAddress == null ? Address.fromString("0x324EebDAa45829c6A8eE903aFBc7B61AF48538df") : dforceStakingVaultAddress

  if (dforceStakingVaultAddress) {
    log.info('Dforce staking vault address before bind: {}', [
      dforceStakingVaultAddress.toHex(),
    ])
    let dforceStakingVaultContract = DForceStakingVaultContract.bind(
      dforceStakingVaultAddress,
    )
    log.info('Dforce Staking Vault address after bind: {}', [
      dforceStakingVaultContract._address.toHex(),
    ])

    dTokenDataEntity.rewardRate = dforceStakingVaultContract.try_rewardRate()
      .reverted
      ? null
      : dforceStakingVaultContract.rewardRate()
    // log.info('Reward rate from contract: {}', [
    //   dforceStakingVaultContract.rewardRate().toString(),
    // ])
    log.info('reward rate from entity: {}', [
      dTokenDataEntity.rewardRate.toString(),
    ])
  }

  log.info(
    'Saving data for cToken: {} - {} for block: {} with transaction hash: {}',
    [
      dTokenDataEntity.dTokenAddress.toHex(),
      dTokenDataEntity.dTokenSymbol,
      dTokenDataEntity.blockNumber.toString(),
      dTokenDataEntity.id,
    ],
  )
  dTokenDataEntity.save()
}
