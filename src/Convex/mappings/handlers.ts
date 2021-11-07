import { log, Bytes, BigInt, Address } from  "@graphprotocol/graph-ts";
import { ConvexBaseRewardsPool } from "../../../generated/ConvexBooster/ConvexBaseRewardsPool";
import { ConvexBooster } from "../../../generated/ConvexBooster/ConvexBooster";
import { ConvexCurvePool } from "../../../generated/ConvexBooster/ConvexCurvePool";
import { ConvexCurveRegistry } from "../../../generated/ConvexBooster/ConvexCurveRegistry";
import { ConvexPoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_BD } from "../../utils/constants";

export function handlePoolEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt
): void {
  let entity = ConvexPoolData.load(txnHash.toHex());
  if (!entity) entity = new ConvexPoolData(txnHash.toHex());

  log.debug("Saving Pool Data at {}", [ poolId.toString() ]);

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.poolId = poolId;

  let convexBoosterContract = ConvexBooster.bind(Address.fromString("0xf403c135812408bfbe8713b5a23a04b3d48aae31"));
  let poolInfo = convexBoosterContract.try_poolInfo(poolId);
  if (poolInfo.reverted) {
    log.error("Could not load poolInfo for pool {}", [ poolId.toString() ]);
    return;
  }

  entity.lpToken = poolInfo.value.value0
  entity.token = poolInfo.value.value1
  entity.gauge = poolInfo.value.value2
  entity.crvRewards = poolInfo.value.value3
  entity.stash = poolInfo.value.value4
  entity.shutdown = poolInfo.value.value5

  let curveRegistryContract = ConvexCurveRegistry.bind(Address.fromString("0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5"));
  let lpTokenAddress = Address.fromString(entity.lpToken.toHexString());
  let swap = curveRegistryContract.try_get_pool_from_lp_token(lpTokenAddress);
  if (swap.reverted) {
    log.error("Could not determine swap for pool {}", [ poolId.toString() ]);
    return;
  }
  entity.swap = swap.value;

  // virtualPrice - virtual price of the underlying Curve lpToken

  let virtualPrice = curveRegistryContract.try_get_virtual_price_from_lp_token(lpTokenAddress);
  if (!virtualPrice.reverted) {
    entity.virtualPrice = convertBINumToDesiredDecimals(virtualPrice.value, 18);
  } else {
    // Curve Factory Pool - get virtual price from lpToken
    let curvePoolContract = ConvexCurvePool.bind(lpTokenAddress);
    virtualPrice = curvePoolContract.try_get_virtual_price();
    if (!virtualPrice.reverted) {
      entity.virtualPrice = convertBINumToDesiredDecimals(virtualPrice.value, 18);
    }
  }

  // crvRatePerSecond - CRV rewards rate per second (for the whole Curve pool)
  let rewardsContract = ConvexBaseRewardsPool.bind(Address.fromString(entity.crvRewards.toHexString()));
  let crvRewardRate = rewardsContract.try_rewardRate();
  if (!crvRewardRate.reverted) {
    entity.crvRatePerSecond = convertBINumToDesiredDecimals(crvRewardRate.value, 18);
  }

  // TODO divide by TVL

  entity.save();
}
