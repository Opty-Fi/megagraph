import {
  yearn_y3Crv,
  DepositCall,
  WithdrawCall
} from "../../generated/yearn_y3Crv/yearn_y3Crv"
import { YearnPoolData } from "../../generated/schema"
import { convertBINumToDesiredDecimals } from "../utils/helpers"
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function updateEntity(
  address: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  txnHash: string
): void {
  let contract = yearn_y3Crv.bind(address)
  let yearnData = YearnPoolData.load(txnHash)

  let pricePerFullShare = contract.try_getPricePerFullShare()
  let balance = contract.try_balance()

  if (!yearnData) {
    yearnData = new YearnPoolData(txnHash)
  }

  yearnData.blockNumber = blockNumber
  yearnData.timestamp = timestamp
  yearnData.token = contract.symbol()
  yearnData.vault = address.toHexString()

  yearnData.balance = !balance.reverted
    ? convertBINumToDesiredDecimals(balance.value, contract.decimals())
    : BigInt.fromI32(0).toBigDecimal()

  yearnData.pricePerFullShare = !pricePerFullShare.reverted
    ? convertBINumToDesiredDecimals(
        pricePerFullShare.value,
        contract.decimals()
      )
    : BigInt.fromI32(0).toBigDecimal()

  yearnData.save()
}

export function handleDeposit(call: DepositCall): void {
  updateEntity(
    call.to,
    call.block.number,
    call.block.timestamp,
    call.transaction.hash.toHexString()
  )
}

export function handleWithdraw(call: WithdrawCall): void {
  updateEntity(
    call.to,
    call.block.number,
    call.block.timestamp,
    call.transaction.hash.toHexString()
  )
}
