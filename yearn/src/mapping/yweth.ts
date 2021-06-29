import {
  yearn_yWETH,
  DepositCall,
  WithdrawCall
} from "../../generated/yearn_yWETH/yearn_yWETH"
import { Balance, PricePerFullShare } from "../../generated/schema"

export function handleDeposit(call: DepositCall): void {
  let contract = yearn_yWETH.bind(call.to)
  let pricePerFullShare = contract.try_getPricePerFullShare()
  if (!pricePerFullShare.reverted) {
    let entity = new PricePerFullShare(call.transaction.hash.toHexString())
    entity.pricePerFullShare = pricePerFullShare.value
    entity.blockNumber = call.block.number
    entity.timestamp = call.block.timestamp
    entity.token = contract.symbol()
    entity.vault = call.to.toHexString()
    entity.save()
  }

  let balance = contract.try_balance()
  if (!balance.reverted) {
    let entity = new Balance(call.transaction.hash.toHexString())
    entity.balance = balance.value
    entity.blockNumber = call.block.number
    entity.timestamp = call.block.timestamp
    entity.token = contract.symbol()
    entity.vault = call.to.toHexString()
    entity.save()
  }
}

export function handleWithdraw(call: WithdrawCall): void {
  let contract = yearn_yWETH.bind(call.to)
  let pricePerFullShare = contract.try_getPricePerFullShare()
  if (!pricePerFullShare.reverted) {
    let entity = new PricePerFullShare(call.transaction.hash.toHexString())
    entity.pricePerFullShare = pricePerFullShare.value
    entity.blockNumber = call.block.number
    entity.timestamp = call.block.timestamp
    entity.token = contract.symbol()
    entity.vault = call.to.toHexString()
    entity.save()
  }

  let balance = contract.try_balance()
  if (!balance.reverted) {
    let entity = new Balance(call.transaction.hash.toHexString())
    entity.balance = balance.value
    entity.blockNumber = call.block.number
    entity.timestamp = call.block.timestamp
    entity.token = contract.symbol()
    entity.vault = call.to.toHexString()
    entity.save()
  }
}
