import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Vault,
  Deposit,
  Invest,
  StrategyChanged,
  Transfer,
  Withdraw
} from "../generated/Vault/Vault"
import {
  PricePerFullShare,
  UnderlyingBalanceWithInvestment,
  UnderlyingBalanceInVault
} from "../generated/schema"

function HandleEntity(
  address: Address,
  blockHash: string,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let contract = Vault.bind(address)

  let pricePerFullShareEntity = new PricePerFullShare(blockHash)
  pricePerFullShareEntity.block = blockNumber
  pricePerFullShareEntity.timestamp = timestamp
  pricePerFullShareEntity.pricePerFullShare = contract.getPricePerFullShare()
  pricePerFullShareEntity.token = contract.name()
  pricePerFullShareEntity.save()

  let underlyingBalanceWithInvestmentEntity = new UnderlyingBalanceWithInvestment(
    blockHash
  )
  underlyingBalanceWithInvestmentEntity.block = blockNumber
  underlyingBalanceWithInvestmentEntity.timestamp = timestamp
  underlyingBalanceWithInvestmentEntity.underlyingBalanceWithInvestment = contract.underlyingBalanceWithInvestment()
  underlyingBalanceWithInvestmentEntity.token = contract.name()
  underlyingBalanceWithInvestmentEntity.save()

  let underlyingBalanceInVaultEntity = new UnderlyingBalanceInVault(blockHash)
  underlyingBalanceInVaultEntity.block = blockNumber
  underlyingBalanceInVaultEntity.timestamp = timestamp
  underlyingBalanceInVaultEntity.underlyingBalanceInVault = contract.underlyingBalanceInVault()
  underlyingBalanceInVaultEntity.token = contract.name()
  underlyingBalanceInVaultEntity.save()
}
export function handleDeposit(event: Deposit): void {
  HandleEntity(
    event.address,
    event.block.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleInvest(event: Invest): void {
  HandleEntity(
    event.address,
    event.block.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleStrategyChanged(event: StrategyChanged): void {
  HandleEntity(
    event.address,
    event.block.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleTransfer(event: Transfer): void {
  HandleEntity(
    event.address,
    event.block.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}

export function handleWithdraw(event: Withdraw): void {
  HandleEntity(
    event.address,
    event.block.hash.toHex(),
    event.block.number,
    event.block.timestamp
  )
}
