import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Vault,
  Deposit,
  Invest,
  StrategyChanged,
  Transfer,
  Withdraw
} from "../../generated/Vault/Vault"
import {
  PricePerFullShare,
  UnderlyingBalanceWithInvestment,
  UnderlyingBalanceInVault
} from "../../generated/schema"

function HandleEntity(
  address: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let contract = Vault.bind(address)

  let pricePerFullShareEntity = new PricePerFullShare(txnHash)
  let pricePerFullShare = contract.try_getPricePerFullShare()
  if (!pricePerFullShare.reverted) {
    pricePerFullShareEntity.blockNumber = blockNumber
    pricePerFullShareEntity.timestamp = timestamp
    pricePerFullShareEntity.pricePerFullShare = pricePerFullShare.value
    pricePerFullShareEntity.token = contract.name()
    pricePerFullShareEntity.save()
  }

  let underlyingBalanceWithInvestmentEntity = new UnderlyingBalanceWithInvestment(
    txnHash
  )
  let underlyingBalanceWithInvestment = contract.try_underlyingBalanceWithInvestment()
  if (!underlyingBalanceWithInvestment.reverted) {
    underlyingBalanceWithInvestmentEntity.blockNumber = blockNumber
    underlyingBalanceWithInvestmentEntity.timestamp = timestamp
    underlyingBalanceWithInvestmentEntity.underlyingBalanceWithInvestment =
      underlyingBalanceWithInvestment.value
    underlyingBalanceWithInvestmentEntity.token = contract.name()
    underlyingBalanceWithInvestmentEntity.save()
  }

  let underlyingBalanceInVaultEntity = new UnderlyingBalanceInVault(txnHash)
  let underlyingBalanceInVault = contract.try_underlyingBalanceInVault()
  if (!underlyingBalanceInVault.reverted) {
    underlyingBalanceInVaultEntity.blockNumber = blockNumber
    underlyingBalanceInVaultEntity.timestamp = timestamp
    underlyingBalanceInVaultEntity.underlyingBalanceInVault =
      underlyingBalanceInVault.value
    underlyingBalanceInVaultEntity.token = contract.name()
    underlyingBalanceInVaultEntity.save()
  }
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
