import { yearn_1, Transfer } from "../../generated/yearn_SUSD/yearn_1"
import { YearnPoolData } from "../../generated/schema"
import { convertBINumToDesiredDecimals, zeroBD } from "../utils/helpers"
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
  yearnData.underlyingToken = contract.token()
  yearnData.symbol = contract.symbol()
  yearnData.vault = address

  yearnData.balance = !balance.reverted
    ? convertBINumToDesiredDecimals(balance.value, contract.decimals())
    : zeroBD()

  yearnData.pricePerFullShare = !pricePerFullShare.reverted
    ? convertBINumToDesiredDecimals(
        pricePerFullShare.value,
        contract.decimals()
      )
    : zeroBD()

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
