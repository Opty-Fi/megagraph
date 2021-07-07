import { yearn_2, Transfer } from "../../generated/yearn_yv1inch/yearn_2"
import { YearnPoolData } from "../../generated/schema"
import { convertBINumToDesiredDecimals } from "../utils/helpers"
import { BigInt, Address } from "@graphprotocol/graph-ts"

export function updateEntity(
  address: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  txnHash: string
): void {
  let contract = yearn_2.bind(address)
  let yearnData = YearnPoolData.load(txnHash)

  let pricePerFullShare = contract.try_pricePerShare()
  let balance = contract.try_totalAssets()

  if (!yearnData) {
    yearnData = new YearnPoolData(txnHash)
  }

  yearnData.blockNumber = blockNumber
  yearnData.timestamp = timestamp
  yearnData.token = contract.symbol()
  yearnData.vault = address.toHexString()

  yearnData.balance = !balance.reverted
    ? convertBINumToDesiredDecimals(balance.value, contract.decimals().toI32())
    : BigInt.fromI32(0).toBigDecimal()

  yearnData.pricePerFullShare = !pricePerFullShare.reverted
    ? convertBINumToDesiredDecimals(
        pricePerFullShare.value,
        contract.decimals().toI32()
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
