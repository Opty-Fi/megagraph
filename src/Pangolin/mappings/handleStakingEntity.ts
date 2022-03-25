import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PangolinStakingData } from "../../../generated/schema";

// Is the same abi for both versions
import { PangolinStakingRewards as StakingRewardContract } from "../../../generated/PangolinStakingRewards/PangolinStakingRewards";
import { PangolinPngToken as PngTokenContract } from "../../../generated/PangolinStakingRewards/PangolinPngToken";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import {
  PANGOLIN_STAKING_REWARDS_ADDRESS,
  PANGOLIN_PNG_TOKEN_ADDRESS,
  ZERO_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from "../../utils/constants";

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

  // instantiate contracts
  let stakingContract = StakingRewardContract.bind(PANGOLIN_STAKING_REWARDS_ADDRESS);
  let pngTokenContract = PngTokenContract.bind(PANGOLIN_PNG_TOKEN_ADDRESS);

  let totalSupplyResult = stakingContract.try_totalSupply();
  if (totalSupplyResult.reverted) {
    log.warning("try_totalSupply()", []);
  } else {
    entity.totalSupply = convertBINumToDesiredDecimals(totalSupplyResult.value, 18);
  }
  // let rewardPerTokenResult = stakingContract.try_rewardPerToken();
  let rewardRateResult = stakingContract.try_rewardRate();
  if (rewardRateResult.reverted) {
    log.warning("try_rewardRate", []);
  } else {
    entity.rewardRate = convertBINumToDesiredDecimals(rewardRateResult.value, 18);
  }
  // let stakingTokenAddressResult = stakingContract.try_stakingToken();
  // let rewardTokenAddressResult = stakingContract.try_rewardsToken();
  // let rewardPerTokenStoredResult = stakingContract.try_rewardPerTokenStored();

  let stakedPngResult = pngTokenContract.try_balanceOf(PANGOLIN_STAKING_REWARDS_ADDRESS);
  if (stakedPngResult.reverted) {
    log.warning("try_balanceOf", []);
  } else {
    entity.totalStakedPNG = convertBINumToDesiredDecimals(stakedPngResult.value, 18);
  }
  entity.save();
}
