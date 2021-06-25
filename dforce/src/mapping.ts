import { BigInt, log, Bytes, Address } from '@graphprotocol/graph-ts'
import {
  dToken as DTokenContract,
  // Approval as ApprovalEvent,
  // FeeRecipientSet as FeeRecipientSetEvent,
  Interest as InterestEvent,
  // LogSetAuthority as LogSetAuthorityEvent,
  // LogSetOwner as LogSetOwnerEvent,
  Mint as MintEvent,
  NewDispatcher as NewDispatcherEvent,
  // NewOriginationFee as NewOriginationFeeEvent,
  // NewSwapModel as NewSwapModelEvent,
  // OwnerUpdate as OwnerUpdateEvent,
  // Paused as PausedEvent,
  Rebalance as RebalanceEvent,
  Redeem as RedeemEvent,
  Transfer as TransferEvent,
  TransferFee as TransferFeeEvent,
  // Unpaused as UnpausedEvent
} from '../generated/dToken/dToken'
import {
  DToken,
  // Approval,
  // FeeRecipientSet,
  // Interest,
  // LogSetAuthority,
  // LogSetOwner,
  // Mint,
  // NewDispatcher,
  // NewOriginationFee,
  // NewSwapModel,
  // OwnerUpdate,
  // Paused,
  // Rebalance,
  // Redeem,
  // Transfer,
  // TransferFee,
  // Unpaused
} from '../generated/schema'

function handleEntity(
  dTokenAddress: Address,
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
): void {
  let dTokenEntity = DToken.load(
    transactionHash.toHex().concat('-').concat(blockNumber.toString()),
  )
  if (dTokenEntity == null) {
    dTokenEntity = new DToken(
      transactionHash.toHex().concat('-').concat(blockNumber.toString()),
    )
  }

  log.info('Contract Address from event: {}', [dTokenAddress.toHex()])
  let dTokenContract = DTokenContract.bind(dTokenAddress)
  log.info('dToken contract address: {}', [dTokenContract._address.toHex()])
  dTokenEntity.blockNumber = blockNumber
  dTokenEntity.blockTimestamp = BigInt.fromI32(blockTimestamp.toI32())
  dTokenEntity.pricePerFullShare = dTokenContract
    .getExchangeRate()
    .toBigDecimal()
  dTokenEntity.balance = dTokenContract.getTotalBalance().toBigDecimal()
  dTokenEntity.dTokenSymbol = dTokenContract.symbol()
  dTokenEntity.dTokenAddress = dTokenAddress

  dTokenEntity.save()
}

export function handleTransfer(event: TransferEvent): void {
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
  // let entity = new Transfer(
  //   event.transaction.hash.toHex() + "-" + event.block.number.toString()
  // )
  // entity.src = event.params.src
  // entity.dst = event.params.dst
  // entity.wad = event.params.wad
  // entity.save()
}

// export function handleApproval(event: ApprovalEvent): void {
//   let entity = new Approval(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.src = event.params.src
//   entity.guy = event.params.guy
//   entity.wad = event.params.wad
//   entity.save()
// }

// export function handleFeeRecipientSet(event: FeeRecipientSetEvent): void {
//   let entity = new FeeRecipientSet(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.oldFeeRecipient = event.params.oldFeeRecipient
//   entity.newFeeRecipient = event.params.newFeeRecipient
//   entity.save()
// }

export function handleInterest(event: InterestEvent): void {
  // let entity = new Interest(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.src = event.params.src
  // entity.interest = event.params.interest
  // entity.increase = event.params.increase
  // entity.totalInterest = event.params.totalInterest
  // entity.save()

  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

// export function handleLogSetAuthority(event: LogSetAuthorityEvent): void {
//   let entity = new LogSetAuthority(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.authority = event.params.authority
//   entity.save()
// }

// export function handleLogSetOwner(event: LogSetOwnerEvent): void {
//   let entity = new LogSetOwner(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.owner = event.params.owner
//   entity.save()
// }

export function handleMint(event: MintEvent): void {
  // let entity = new Mint(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.account = event.params.account
  // entity.pie = event.params.pie
  // entity.wad = event.params.wad
  // entity.totalSupply = event.params.totalSupply
  // entity.exchangeRate = event.params.exchangeRate
  // entity.save()
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleNewDispatcher(event: NewDispatcherEvent): void {
  // let entity = new NewDispatcher(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.oldDispatcher = event.params.oldDispatcher
  // entity.Dispatcher = event.params.Dispatcher
  // entity.save()
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

// export function handleNewOriginationFee(event: NewOriginationFeeEvent): void {
//   let entity = new NewOriginationFee(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.sig = event.params.sig
//   entity.oldOriginationFeeMantissa = event.params.oldOriginationFeeMantissa
//   entity.newOriginationFeeMantissa = event.params.newOriginationFeeMantissa
//   entity.save()
// }

// export function handleNewSwapModel(event: NewSwapModelEvent): void {
//   let entity = new NewSwapModel(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity._oldSwapModel = event.params._oldSwapModel
//   entity._newSwapModel = event.params._newSwapModel
//   entity.save()
// }

// export function handleOwnerUpdate(event: OwnerUpdateEvent): void {
//   let entity = new OwnerUpdate(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.owner = event.params.owner
//   entity.newOwner = event.params.newOwner
//   entity.save()
// }

// export function handlePaused(event: PausedEvent): void {
//   let entity = new Paused(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.account = event.params.account
//   entity.save()
// }

export function handleRebalance(event: RebalanceEvent): void {
  // let entity = new Rebalance(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.withdraw = event.params.withdraw
  // entity.withdrawAmount = event.params.withdrawAmount
  // entity.supply = event.params.supply
  // entity.supplyAmount = event.params.supplyAmount
  // entity.save()
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleRedeem(event: RedeemEvent): void {
  // let entity = new Redeem(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.account = event.params.account
  // entity.pie = event.params.pie
  // entity.wad = event.params.wad
  // entity.totalSupply = event.params.totalSupply
  // entity.exchangeRate = event.params.exchangeRate
  // entity.save()

  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

export function handleTransferFee(event: TransferFeeEvent): void {
  // let entity = new TransferFee(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.token = event.params.token
  // entity.feeRecipient = event.params.feeRecipient
  // entity.amount = event.params.amount
  // entity.save()
  handleEntity(
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}

// export function handleUnpaused(event: UnpausedEvent): void {
//   let entity = new Unpaused(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   )
//   entity.account = event.params.account
//   entity.save()
// }
