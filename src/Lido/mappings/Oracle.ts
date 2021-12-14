import { BigInt } from "@graphprotocol/graph-ts";
import { Completed, LidoOracle, PostTotalShares } from "../../../generated/LidoOracle/LidoOracle";
import { LidoToken } from "../../../generated/LidoTokenstETH/LidoToken";

import { LidoRewardData, LidoTotals, LidoOracleTotals } from "../../../generated/schema";
//import { loadLidoContract, loadOracleContract, LIDO_DEPOSIT_AMOUNT, LIDO_CALCULATION_UNIT } from "./lidoConstants";
import { ZERO_BI, LidoTokenAddress, LidoOracleAddress } from "../../utils/constants";

const LIDO_DEPOSIT_AMOUNT = BigInt.fromI32(32).times(BigInt.fromString("1000000000000000000")); // 32 ETH
const LIDO_CALCULATION_UNIT = BigInt.fromI32(10000);

export function handleCompleted(event: Completed): void {
  let lastOracle = LidoOracleTotals.load("") as LidoOracleTotals;
  let newOracle = new LidoOracleTotals("") as LidoOracleTotals;

  newOracle.beaconBalance = event.params.beaconBalance;
  newOracle.beaconValidators = event.params.beaconValidators;

  newOracle.save();

  let lidoContract = LidoToken.bind(LidoTokenAddress);
  let oracleContract = LidoOracle.bind(LidoOracleAddress);

  // Trying to set just one oracle

  let oldBeaconValidators = lastOracle ? lastOracle.beaconValidators : ZERO_BI;

  let oldBeaconBalance = lastOracle ? lastOracle.beaconBalance : ZERO_BI;

  let newBeaconValidators = event.params.beaconValidators;
  let newBeaconBalance = event.params.beaconBalance;

  // TODO: Can appearedValidators be negative? If eg active keys are deleted for some reason
  let appearedValidators = newBeaconValidators.minus(oldBeaconValidators);
  let appearedValidatorsDeposits = appearedValidators.times(LIDO_DEPOSIT_AMOUNT);
  let rewardBase = appearedValidatorsDeposits.plus(oldBeaconBalance);
  let newTotalRewards = newBeaconBalance.minus(rewardBase);

  let positiveRewards = newTotalRewards.gt(ZERO_BI);

  // Totals and rewards data logic
  // Totals are already non-null on first oracle report
  let totals = LidoTotals.load("") as LidoTotals;
  // Increasing or decreasing totals
  let totalPooledEtherAfter = positiveRewards
    ? totals.totalPooledEther.plus(newTotalRewards)
    : totals.totalPooledEther.minus(newTotalRewards.abs());

  if (!positiveRewards) {
    totals.totalPooledEther = totalPooledEtherAfter;
    return;
  }

  let entity = new LidoRewardData(event.transaction.hash.toHex());

  entity.blockNumber = event.block.number;
  entity.totalRewardsWithFees = newTotalRewards;
  entity.totalRewards = newTotalRewards;
  entity.totalFee = ZERO_BI;

  let feeBasis = BigInt.fromI32(lidoContract.getFee()); // 1000

  // Overall shares for all rewards cut
  let shares2mint = positiveRewards
    ? newTotalRewards
        .times(feeBasis)
        .times(totals.totalShares)
        .div(totalPooledEtherAfter.times(LIDO_CALCULATION_UNIT).minus(feeBasis.times(newTotalRewards)))
    : ZERO_BI;

  let totalSharesAfter = totals.totalShares.plus(shares2mint);
  totals.totalPooledEther = totalPooledEtherAfter;
  totals.totalShares = totalSharesAfter;
  totals.save();

  entity.blockTimestamp = event.block.timestamp;
  entity.epochId = oracleContract.getCurrentEpochId();
  entity.save();
}
export function handlePostTotalShares(event: PostTotalShares): void {
  let lidoContract = LidoToken.bind(LidoTokenAddress);
  let preTotalPooledEther = event.params.preTotalPooledEther;

  let postTotalPooledEther = event.params.postTotalPooledEther;

  let entity = LidoRewardData.load(event.transaction.hash.toHex());
  if (!entity) {
    return;
  }
  entity.timeElapsed = event.params.timeElapsed;
  /**
  
  aprRaw -> aprBeforeFees -> apr
  
  aprRaw - APR straight from validator balances without adjustments
  aprBeforeFees - APR compensated for time difference between oracle reports
  apr - APR with fees subtracted and time-compensated
  
  **/

  // APR without subtracting fees and without any compensations
  let aprRaw = postTotalPooledEther
    .toBigDecimal()
    .div(preTotalPooledEther.toBigDecimal())
    .minus(BigInt.fromI32(1).toBigDecimal())
    .times(BigInt.fromI32(100).toBigDecimal())
    .times(BigInt.fromI32(365).toBigDecimal());

  // Time compensation logic

  let timeElapsed = event.params.timeElapsed;
  let day = BigInt.fromI32(60 * 60 * 24).toBigDecimal();
  let dayDifference = timeElapsed.toBigDecimal().div(day);
  let aprBeforeFees = aprRaw.div(dayDifference);

  entity.aprBeforeFees = aprBeforeFees;
  // Subtracting fees

  let feeBasis = BigInt.fromI32(lidoContract.getFee()).toBigDecimal(); // 1000

  let apr = aprBeforeFees.minus(
    aprBeforeFees.times(LIDO_CALCULATION_UNIT.toBigDecimal()).div(feeBasis).div(BigInt.fromI32(100).toBigDecimal()),
  );

  entity.apr = apr;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}
