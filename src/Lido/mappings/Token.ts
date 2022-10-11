import { BigInt } from "@graphprotocol/graph-ts";

import { Transfer, Submitted, Withdrawal } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoTokenData, LidoRewardData, LidoTotals } from "../../../generated/schema";
import { ZERO_BI, LidoTreasuryAddress, ZERO_ADDRESS } from "../../utils/constants";

export function handleTransfer(event: Transfer): void {
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }

  let fromZeros = event.params.from == ZERO_ADDRESS;

  let lidoRewards = LidoRewardData.load(event.transaction.hash.toHex());
  let totalsLoad = LidoTotals.load("");
  let totals = !totalsLoad ? new LidoTotals("") : totalsLoad;
  let totalPooledEther = totals.totalPooledEther;
  let totalShares = totals.totalShares;

  entity.totalPooledEther = totalPooledEther;
  entity.totalShares = totalShares;
  let isFeeDistributionToTreasury = fromZeros && event.params.to == LidoTreasuryAddress;

  // graph-ts less or equal to dust boundary
  let LIDO_DUST_BOUNDARY = BigInt.fromI32(50000);
  let isDust = event.params.value.lt(LIDO_DUST_BOUNDARY);

  if (lidoRewards != null && isFeeDistributionToTreasury && !isDust) {
    lidoRewards.totalRewards = lidoRewards.totalRewards.minus(event.params.value);
    lidoRewards.totalFee = lidoRewards.totalFee.plus(event.params.value);

    lidoRewards.save();
  } else if (lidoRewards != null && isFeeDistributionToTreasury && isDust) {
    lidoRewards.totalRewards = lidoRewards.totalRewards.minus(event.params.value);
    lidoRewards.totalFee = lidoRewards.totalFee.plus(event.params.value);

    lidoRewards.save();
  } else if (lidoRewards != null && fromZeros) {
    lidoRewards.totalRewards = lidoRewards.totalRewards.minus(event.params.value);
    lidoRewards.totalFee = lidoRewards.totalFee.plus(event.params.value);

    lidoRewards.save();
  }

  entity.save();
}

export function handleSubmitted(event: Submitted): void {
  let totalsLoad = LidoTotals.load("");

  let isFirstSubmission = !totalsLoad;

  if (isFirstSubmission) {
    totalsLoad = new LidoTotals("");
    totalsLoad.totalPooledEther = ZERO_BI;
    totalsLoad.totalShares = ZERO_BI;
  }
  let totals = totalsLoad as LidoTotals;

  // creating a new LidoTokenData entity
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity === null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
  }

  // At deployment ratio is 1:1
  let shares = !isFirstSubmission
    ? event.params.amount.times(totals.totalShares).div(totals.totalPooledEther)
    : event.params.amount;

  totals.totalPooledEther = totals.totalPooledEther.plus(event.params.amount);
  totals.totalShares = totals.totalShares.plus(shares);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;

  entity.totalPooledEther = totals.totalPooledEther;

  entity.totalShares = totals.totalShares;

  entity.save();
  totals.save();
}

export function handleWithdrawal(event: Withdrawal): void {
  // creating a new LidoTokenData if not existent already
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity === null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
  }
  let totalsLoad = LidoTotals.load("");
  let totals = !totalsLoad ? new LidoTotals("") : totalsLoad;

  entity.totalPooledEther = totals.totalPooledEther;

  entity.totalShares = totals.totalShares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}
