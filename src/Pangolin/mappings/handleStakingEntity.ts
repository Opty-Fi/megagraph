import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PangolinStakingData } from "../../../generated/schema";
import { PangolinStakingRewards as StakingRewardContract } from "../../../generated/PangolinStakingRewards/PangolinStakingRewards";
import { PangolinPngToken as PngTokenContract } from "../../../generated/PangolinStakingRewards/PangolinPngToken";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { PANGOLIN_STAKING_REWARDS_ADDRESS, PANGOLIN_PNG_TOKEN_ADDRESS } from "../../utils/constants";

export function handleStakingEntity(
  txHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  eventType: string,
  amount: BigInt,
): void {
  let entity = PangolinStakingData.load(txHash.toHex());
  if (!entity) entity = new PangolinStakingData(txHash.toHex());
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.event = eventType;

  let stakingContract = StakingRewardContract.bind(PANGOLIN_STAKING_REWARDS_ADDRESS);
  let pngTokenContract = PngTokenContract.bind(PANGOLIN_PNG_TOKEN_ADDRESS);

  let totalSupplyResult = stakingContract.try_totalSupply();
  if (totalSupplyResult.reverted) {
    log.warning("try_totalSupply() reverted", []);
  } else {
    entity.totalSupply = convertBINumToDesiredDecimals(totalSupplyResult.value, 18);
  }
  let rewardRateResult = stakingContract.try_rewardRate();
  if (rewardRateResult.reverted) {
    log.warning("try_rewardRate() reverted", []);
  } else {
    entity.rewardRate = convertBINumToDesiredDecimals(rewardRateResult.value, 18);
  }

  let stakedPngResult = pngTokenContract.try_balanceOf(PANGOLIN_STAKING_REWARDS_ADDRESS);
  if (stakedPngResult.reverted) {
    log.warning("try_balanceOf() reverted", []);
  } else {
    entity.totalStakedPNG = convertBINumToDesiredDecimals(stakedPngResult.value, 18);
  }
  let actualAmount = convertBINumToDesiredDecimals(amount, 18);
  if (eventType == "Withdraw") {
    entity.totalStakedPNG = entity.totalStakedPNG.minus(actualAmount);
  } else {
    entity.totalStakedPNG = entity.totalStakedPNG.plus(actualAmount);
  }
  entity.save();
}
