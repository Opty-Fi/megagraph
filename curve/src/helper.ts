import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { Curve as Curve4Pool } from "../generated/Curve4Pool/Curve"
import { Curve as Curve3Pool } from "../generated/Curve3Pool/Curve"
import { Curve as Curve2Pool } from "../generated/Curve2Pool/Curve"
import { Balance, VirtualPrice } from "../generated/schema"

export const N_COINS_CURVE2POOL = 2
export const N_COINS_CURVE3POOL = 3
export const N_COINS_CURVE4POOL = 4

export function handleExchangeEvent(
  address: Address,
  sold_id: BigInt,
  bought_id: BigInt,
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolType: string
): void {
  handleUpdateOneBalance(
    address,
    sold_id,
    txnHash,
    blockNumber,
    timestamp,
    poolType
  )

  handleUpdateOneBalance(
    address,
    bought_id,
    txnHash,
    blockNumber,
    timestamp,
    poolType
  )
}

export function handleUpdateVirtualPrice(
  address: Address,
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolType: string
): void {
  let virtualPrice: ethereum.CallResult<BigInt>
  if (poolType === "Curve4Pool") {
    let contract = Curve4Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve3Pool") {
    let contract = Curve3Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else {
    let contract = Curve2Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  }

  if (!virtualPrice.reverted) {
    let virtualPriceEntity = new VirtualPrice(txnHash.toHexString())
    virtualPriceEntity.virtualPrice = virtualPrice.value
    virtualPriceEntity.vault = address.toHexString()
    virtualPriceEntity.blockNumber = blockNumber
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
  for (let i = 0; i < nCoin; i++) {
    handleUpdateOneBalance(
      address,
      BigInt.fromI32(i),
      txnHash,
      blockNumber,
      timestamp,
      poolType
    )
  }
}

export function handleUpdateOneBalance(
  address: Address,
  coinIndex: BigInt,
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolType: string
): void {
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

  if (!balance.reverted) {
    let balanceEntity = new Balance(
      txnHash.toHexString() + coinIndex.toHexString()
    )
    balanceEntity.balance = balance.value
    balanceEntity.blockNumber = blockNumber
    balanceEntity.timestamp = timestamp
    balanceEntity.vault = address.toHexString()
    balanceEntity.token = token.reverted ? "" : token.value.toHexString()
    balanceEntity.save()
  }
}
