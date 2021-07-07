import { yearn_1, Transfer } from "../../generated/yearn_SUSD/yearn_1"
import { YearnPoolData } from "../../generated/schema"
import { convertBINumToDesiredDecimals } from "../utils/helpers"
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function updateEntity(
  address: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  txnHash: string
): void {
  let contract = yearn_1.bind(address)
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

export function handleTransfer(event: Transfer): void {
  updateEntity(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString()
  )
}
