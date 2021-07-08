import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum
} from "@graphprotocol/graph-ts"
import { Curve as Curve2Pool } from "../generated/Curve2Pool/Curve"
import { Curve as Curve3Pool } from "../generated/Curve3Pool/Curve"
import { Curve as Curve4Pool } from "../generated/Curve4Pool/Curve"
import { ERC20 } from "../generated/Curve2Pool/ERC20"
import { Balance, VirtualPrice } from "../generated/schema"
import { convertBINumToDesiredDecimals } from "./utils/converters"

export const N_COINS_CURVE2POOL = 2
export const N_COINS_CURVE3POOL = 3
export const N_COINS_CURVE4POOL = 4

export function handleUpdateVirtualPrice(
  address: Address,
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolType: string
): void {
  let virtualPrice: ethereum.CallResult<BigInt>
  if (poolType === "Curve4Pool") {
    let contract = Curve2Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve3Pool") {
    let contract = Curve2Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else {
    let contract = Curve2Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  }

  if (!virtualPrice.reverted) {
    let virtualPriceEntity = VirtualPrice.load(txnHash.toHexString())
    if (!virtualPriceEntity) {
      virtualPriceEntity = new VirtualPrice(txnHash.toHexString())
    }

    virtualPriceEntity.virtualPrice = convertBINumToDesiredDecimals(
      virtualPrice.value,
      18
    )

    virtualPriceEntity.vault = address.toHexString()
    virtualPriceEntity.blockNumber = blockNumber.toString()
    virtualPriceEntity.timestamp = timestamp
    virtualPriceEntity.save()
  }
}

export function handleUpdateAllBalances(
  address: Address,
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  nCoin: number,
  poolType: string
): void {
  let balances: Array<BigDecimal> = []
  let tokens: Array<string> = []
  for (let i = 0; i < nCoin; i++) {
    balances.push(getBalance(address, BigInt.fromI32(i), poolType))
    tokens.push(getToken(address, BigInt.fromI32(i), poolType))
  }
  let balanceEntity = Balance.load(txnHash.toHexString())
  if (!balanceEntity) {
    balanceEntity = new Balance(txnHash.toHexString())
  }

  balanceEntity.balance = balances
  balanceEntity.blockNumber = blockNumber.toString()
  balanceEntity.timestamp = timestamp
  balanceEntity.vault = address.toHexString()
  balanceEntity.token = tokens
  balanceEntity.save()
}

export function getBalance(
  address: Address,
  coinIndex: BigInt,
  poolType: string
): BigDecimal {
  let balance: ethereum.CallResult<BigInt>
  let token: ethereum.CallResult<Address>

  if (poolType === "Curve4Pool") {
    let contract = Curve4Pool.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve3Pool") {
    let contract = Curve3Pool.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else {
    let contract = Curve2Pool.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  }

  if (!balance.reverted && !token.reverted) {
    let tokenContract = ERC20.bind(token.value)
    let decimal = tokenContract.try_decimals()
    return !decimal.reverted
      ? convertBINumToDesiredDecimals(balance.value, decimal.value)
      : balance.value.toBigDecimal()
  }
  return BigDecimal.fromString("0")
}

export function getToken(
  address: Address,
  coinIndex: BigInt,
  poolType: string
): string {
  let token: ethereum.CallResult<Address>

  if (poolType === "Curve4Pool") {
    let contract = Curve4Pool.bind(address)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve3Pool") {
    let contract = Curve3Pool.bind(address)
    token = contract.try_coins(coinIndex)
  } else {
    let contract = Curve2Pool.bind(address)
    token = contract.try_coins(coinIndex)
  }
  return !token.reverted ? token.value.toHexString() : ""
}
