import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts"
import {
  Vault,
  Deposit,
  Invest,
  StrategyChanged,
  Transfer,
  Withdraw
} from "../../generated/Vault/Vault"
import { HarvestVaultData } from "../../generated/schema"
import { convertBINumToDesiredDecimals } from "../utils/helpers"
function HandleEntity(
  address: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let contract = Vault.bind(address)
  let harvestVaultData = HarvestVaultData.load(txnHash)
  if (harvestVaultData == null) {
    harvestVaultData = new HarvestVaultData(txnHash)
  }
  let pricePerFullShare = contract.try_getPricePerFullShare()
  let underlyingBalanceWithInvestment =
    contract.try_underlyingBalanceWithInvestment()
  let underlyingBalanceInVault = contract.try_underlyingBalanceInVault()

  harvestVaultData.blockNumber = blockNumber
  harvestVaultData.timestamp = timestamp
  harvestVaultData.token = contract.name()
  harvestVaultData.pricePerFullShare = !pricePerFullShare.reverted
    ? convertBINumToDesiredDecimals(
        pricePerFullShare.value,
        contract.decimals()
      )
    : BigInt.fromI32(0).toBigDecimal()
  harvestVaultData.underlyingBalanceWithInvestment =
    !underlyingBalanceWithInvestment.reverted
      ? convertBINumToDesiredDecimals(
          underlyingBalanceWithInvestment.value,
          contract.decimals()
        )
      : BigInt.fromI32(0).toBigDecimal()
  harvestVaultData.underlyingBalanceInVault = !underlyingBalanceInVault.reverted
    ? convertBINumToDesiredDecimals(
        underlyingBalanceInVault.value,
        contract.decimals()
      )
    : BigInt.fromI32(0).toBigDecimal()
  harvestVaultData.save()
}

export function handleDeposit(event: Deposit): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleInvest(event: Invest): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleStrategyChanged(event: StrategyChanged): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleTransfer(event: Transfer): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleWithdraw(event: Withdraw): void {
  HandleEntity(
    event.address,
    event.transaction.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}
