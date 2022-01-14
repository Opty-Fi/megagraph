import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { QuickSwapPoolData } from "../../../generated/schema";
import { QuickSwapStakingRewards } from "../../../generated/QuickSwapStakingRewardsUSDC-WETH/QuickSwapStakingRewards";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

export function handlePoolEntity(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, address: Address): void {
  let entity = QuickSwapPoolData.load(txnHash.toHex());
  if (!entity) entity = new QuickSwapPoolData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;

  let stakingRewardsContract = QuickSwapStakingRewards.bind(address);

  let stakingTokenResult = stakingRewardsContract.try_stakingToken();
  if (!stakingTokenResult.reverted) {
    entity.stakingToken = stakingTokenResult.value;
  } else {
    log.error("Could not get stakingToken for {}", [address.toString()]);
  }

  let rewardsTokenResult = stakingRewardsContract.try_rewardsToken();
  if (!rewardsTokenResult.reverted) {
    entity.rewardsToken = rewardsTokenResult.value;
  } else {
    log.error("Could not get rewardsToken for {}", [address.toString()]);
  }

  let rewardRateResult = stakingRewardsContract.try_rewardRate();
  if (!rewardRateResult.reverted) {
    entity.rewardRate = convertBINumToDesiredDecimals(rewardRateResult.value, 18);
  } else {
    log.error("Could not get rewardRate for {}", [address.toString()]);
  }

  let totalSupplyResult = stakingRewardsContract.try_totalSupply();
  if (!totalSupplyResult.reverted) {
    entity.totalSupply = totalSupplyResult.value;
  } else {
    log.error("Could not get totalSupply for {}", [address.toString()]);
  }

  entity.save();
}
