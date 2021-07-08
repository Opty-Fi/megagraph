import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { HarvestPoolData } from "../../generated/HarvestPoolData/HarvestPoolData"
import { Vault } from "../../generated/Vault_fDAI/Vault"
import { HarvestData } from "../../generated/schema"
import { convertToLowerCase, convertBINumToDesiredDecimals } from "./convertors"

export function handleEntity(
  poolAddr: Address,
  vaultAddr: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let harvestData = HarvestData.load(txnHash)
  if (!harvestData) {
    harvestData = new HarvestData(txnHash)
  }
  harvestData.blockNumber = blockNumber
  harvestData.timestamp = timestamp
  if (poolAddr == null) {
    if (
      convertToLowerCase(vaultAddr.toHex()) ==
      convertToLowerCase("0xab7fa2b2985bccfc13c6d86b1d5a17486ab1e04c")
    ) {
      poolAddr = convertStringToAddress(
        "0x15d3A64B2d5ab9E152F16593Cdebc4bB165B5B4A"
      )
    }
  }
  if (poolAddr != null) {
    let poolContract = HarvestPoolData.bind(poolAddr)
    let lastUpdateTime = poolContract.try_lastUpdateTime()
    let rewardRate = poolContract.try_rewardRate()
    let rewardPerTokenStored = poolContract.try_rewardPerTokenStored()
    harvestData.lastUpdateTime = !lastUpdateTime.reverted
      ? lastUpdateTime.value
      : BigInt.fromI32(0)
    harvestData.rewardRate = !rewardRate.reverted
      ? rewardRate.value
      : BigInt.fromI32(0)
    harvestData.rewardPerTokenStored = !rewardPerTokenStored.reverted
      ? rewardPerTokenStored.value
      : BigInt.fromI32(0)
    harvestData.pool = poolAddr.toHexString()
  } else {
    harvestData.lastUpdateTime = BigInt.fromI32(0)
    harvestData.rewardRate = BigInt.fromI32(0)
    harvestData.rewardPerTokenStored = BigInt.fromI32(0)
    harvestData.pool = ""
  }

  if (vaultAddr == null) {
    let poolContract = HarvestPoolData.bind(poolAddr)
    let vault = poolContract.try_lpToken()
    vaultAddr = !vault.reverted ? vault.value : null
  }

  if (vaultAddr != null) {
    let contract = Vault.bind(vaultAddr)
    let pricePerFullShare = contract.try_getPricePerFullShare()
    let underlyingBalanceWithInvestment = contract.try_underlyingBalanceWithInvestment()
    let underlyingBalanceInVault = contract.try_underlyingBalanceInVault()
    harvestData.pricePerFullShare = !pricePerFullShare.reverted
      ? convertBINumToDesiredDecimals(
          pricePerFullShare.value,
          contract.decimals()
        )
      : BigInt.fromI32(0).toBigDecimal()
    harvestData.underlyingBalanceWithInvestment = !underlyingBalanceWithInvestment.reverted
      ? convertBINumToDesiredDecimals(
          underlyingBalanceWithInvestment.value,
          contract.decimals()
        )
      : BigInt.fromI32(0).toBigDecimal()
    harvestData.underlyingBalanceInVault = !underlyingBalanceInVault.reverted
      ? convertBINumToDesiredDecimals(
          underlyingBalanceInVault.value,
          contract.decimals()
        )
      : BigInt.fromI32(0).toBigDecimal()
    harvestData.vault = vaultAddr.toHexString()
  } else {
    harvestData.pricePerFullShare = BigInt.fromI32(0).toBigDecimal()
    harvestData.underlyingBalanceWithInvestment = BigInt.fromI32(
      0
    ).toBigDecimal()
    harvestData.underlyingBalanceInVault = BigInt.fromI32(0).toBigDecimal()
    harvestData.vault = ""
  }

  harvestData.save()
}

export function convertStringToAddress(addr: string): Address {
  return Address.fromString(addr.toString())
}
