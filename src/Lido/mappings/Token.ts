import { Address } from "@graphprotocol/graph-ts";
import { Transfer, Submitted, Withdrawal } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoTokenData, LidoRewardData, LidoTotals } from "../../../generated/schema";
import { LIDO_DUST_BOUNDARY } from "./lidoConstants";
import { ZERO_BI, LidoTreasuryAddress } from "../../utils/constants";
export function handleTransfer(event: Transfer): void {
  // new lido event.

  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }

  let fromZeros = event.params.from == Address.fromString("0x0000000000000000000000000000000000000000");

  let lidoRewards = LidoRewardData.load(event.transaction.hash.toHex());
  let totals = LidoTotals.load("") as LidoTotals;
  let totalPooledEther = totals.totalPooledEther;
  let totalShares = totals.totalShares;

  entity.totalPooledEther = totalPooledEther;
  entity.totalShares = totalShares;
  let isFeeDistributionToTreasury = fromZeros && event.params.to == LidoTreasuryAddress;

  // graph-ts less or equal to
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
  let totals = LidoTotals.load("");

  let isFirstSubmission = !totals;

  if (!totals) {
    totals = new LidoTotals("");
    totals.totalPooledEther = ZERO_BI;
    totals.totalShares = ZERO_BI;
  }

  // new lido event.
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
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
  // new lido event.
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
  }
  let totals = LidoTotals.load("");

  entity.totalPooledEther = totals.totalPooledEther;

  entity.totalShares = totals.totalShares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}
