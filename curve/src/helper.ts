import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { Curve as Curve4Pool } from "../generated/Curve4Pool/Curve"
import { Curve as Curve3Pool } from "../generated/Curve3Pool/Curve"
import { Curve as Curve2Pool } from "../generated/Curve2Pool/Curve"
import { ERC20 } from "../generated/Curve2Pool/ERC20"
import { Curve as Curve2Pool_RSV3CRV } from "../generated/Curve2Pool_RSV3CRV/Curve"
import { Curve as Curve2Pool_TBTC_SBTCCRV } from "../generated/Curve2Pool_TBTC_SBTCCRV/Curve"
import { Curve as Curve2Pool_hCRV } from "../generated/Curve2Pool_HCRV/Curve"
import { Curve as Curve2Pool_BBTC } from "../generated/Curve2Pool_BBTC/Curve"
import { Curve as Curve2Pool_EURS } from "../generated/Curve2Pool_EURS/Curve"
import { Curve as Curve2Pool_PBTC } from "../generated/Curve2Pool_PBTC/Curve"
import { Curve as Curve2Pool_ankrCRV } from "../generated/Curve2Pool_ankrCRV/Curve"
import { Curve as Curve2Pool_steCRV } from "../generated/Curve2Pool_steCRV/Curve"
import { Curve as Curve2Pool_ust3CRV } from "../generated/Curve2Pool_ust3CRV/Curve"
import { Curve as Curve2Pool_cDAI_cUSDC } from "../generated/Curve2Pool_cDAI_cUSDC/Curve"
import { Curve as Curve2Pool_crvRenWBTC } from "../generated/Curve2Pool_crvRenWBTC/Curve"
import { Curve as Curve3Pool_aave } from "../generated/Curve3Pool_aave/Curve"
import { Curve as Curve3Pool_crvRenWSBTC } from "../generated/Curve3Pool_crvRenWSBTC/Curve"
import { Curve as Curve4Pool_ypaxCrv } from "../generated/Curve4Pool_ypaxCrv/Curve"
import { Curve as Curve4Pool_crvRenWBTC } from "../generated/Curve4Pool_crvRenWBTC/Curve"
import { Balance, VirtualPrice } from "../generated/schema"
import { convertBINumToDesiredDecimals } from "./utils/converters"

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
  } else if (poolType === "Curve4Pool_ypaxCrv") {
    let contract = Curve4Pool_ypaxCrv.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve4Pool_crvRenWBTC") {
    let contract = Curve4Pool_crvRenWBTC.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve3Pool") {
    let contract = Curve3Pool.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve3Pool_aave") {
    let contract = Curve3Pool_aave.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve3Pool_crvRenWSBTC") {
    let contract = Curve3Pool_crvRenWSBTC.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_RSV3CRV") {
    let contract = Curve2Pool_RSV3CRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_TBTC_SBTCCRV") {
    let contract = Curve2Pool_TBTC_SBTCCRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_HCRV") {
    let contract = Curve2Pool_hCRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_BBTC") {
    let contract = Curve2Pool_BBTC.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_EURS") {
    let contract = Curve2Pool_EURS.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_ankrCRV") {
    let contract = Curve2Pool_ankrCRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_PBTC") {
    let contract = Curve2Pool_PBTC.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_steCRV") {
    let contract = Curve2Pool_steCRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_ust3CRV") {
    let contract = Curve2Pool_ust3CRV.bind(address)
    virtualPrice = contract.try_get_virtual_price()
  } else if (poolType === "Curve2Pool_cDAI_cUSDC") {
    let contract = Curve2Pool_cDAI_cUSDC.bind(address)
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
  } else if (poolType === "Curve4Pool_ypaxCrv") {
    let contract = Curve4Pool_ypaxCrv.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve4Pool_crvRenWBTC") {
    let contract = Curve4Pool_ypaxCrv.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve3Pool") {
    let contract = Curve3Pool.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve3Pool_aave") {
    let contract = Curve3Pool_aave.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve3Pool_crvRenWSBTC") {
    let contract = Curve3Pool_crvRenWSBTC.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_RSV3CRV") {
    let contract = Curve2Pool_RSV3CRV.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_TBTC_SBTCCRV") {
    let contract = Curve2Pool_TBTC_SBTCCRV.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_HCRV") {
    let contract = Curve2Pool_hCRV.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_BBTC") {
    let contract = Curve2Pool_BBTC.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_EURS") {
    let contract = Curve2Pool_EURS.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_ankrCRV") {
    let contract = Curve2Pool_EURS.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_PBTC") {
    let contract = Curve2Pool_EURS.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_steCRV") {
    let contract = Curve2Pool_EURS.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_ust3CRV") {
    let contract = Curve2Pool_EURS.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_cDAI_cUSDC") {
    let contract = Curve2Pool_cDAI_cUSDC.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else if (poolType === "Curve2Pool_crvRenWBTC") {
    let contract = Curve2Pool_crvRenWBTC.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  } else {
    let contract = Curve2Pool.bind(address)
    balance = contract.try_balances(coinIndex)
    token = contract.try_coins(coinIndex)
  }

  if (!balance.reverted) {
    let tokenContract = ERC20.bind(token.value)
    let balanceEntity = Balance.load(
      txnHash.toHexString() + coinIndex.toHexString()
    )
    if (!balanceEntity) {
      balanceEntity = new Balance(
        txnHash.toHexString() + coinIndex.toHexString()
      )
    }
    let decimal = tokenContract.try_decimals()
    balanceEntity.balance = !decimal.reverted
      ? convertBINumToDesiredDecimals(balance.value, decimal.value)
      : balance.value.toBigDecimal()
    balanceEntity.blockNumber = blockNumber
    balanceEntity.timestamp = timestamp
    balanceEntity.vault = address.toHexString()
    balanceEntity.token = token.reverted ? "" : token.value.toHexString()
    balanceEntity.save()
  }
}
