import { log, Bytes, BigInt, Address } from  "@graphprotocol/graph-ts";
import { ConvexBaseRewardsPool } from "../../../generated/ConvexBooster/ConvexBaseRewardsPool";
import { ConvexBooster } from "../../../generated/ConvexBooster/ConvexBooster";
import { ConvexCurvePool } from "../../../generated/ConvexBooster/ConvexCurvePool";
import { ConvexCurveRegistry } from "../../../generated/ConvexBooster/ConvexCurveRegistry";
import { ConvexExtraRewardStashV1 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV1";
import { ConvexPoolData, ConvexTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { ConvexBoosterAddress, CurveRegistryAddress, ZERO_ADDRESS } from "../../utils/constants";
import { getExtras } from "./extras";
import { getCvxMintAmount } from "./convex";

export function handlePoolEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt
): void {
  let entity = ConvexTokenData.load(txnHash.toHex());
  if (!entity) entity = new ConvexTokenData(txnHash.toHex());

  entity.blockNumber    = blockNumber;
  entity.blockTimestamp = timestamp;

  let pool = getPoolData(poolId);
  entity.pool = pool.id;

  // virtualPrice - virtual price of the underlying Curve lpToken

  let curveRegistryContract = ConvexCurveRegistry.bind(CurveRegistryAddress);
  let lpTokenAddress = convertBytesToAddress(pool.lpToken);
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

  // totalSupply (TVL = totalSupply * virtualPrice)

  let rewardsContract = ConvexBaseRewardsPool.bind(convertBytesToAddress(pool.crvRewards));
  let supply = rewardsContract.try_totalSupply();
  if (!supply.reverted) {
    entity.totalSupply = supply.value;
  }

  // crvRatePerSecond - CRV rewards rate per second (for the whole Curve pool)
  // cvxRatePerSecond - CVX rewards rate per second (for the whole Curve pool)

  let crvRewardRate = rewardsContract.try_rewardRate();
  if (!crvRewardRate.reverted) {
    let crvRatePerSecond = convertBINumToDesiredDecimals(crvRewardRate.value, 18)
    entity.crvRatePerSecond = crvRatePerSecond;
    entity.cvxRatePerSecond = getCvxMintAmount(crvRatePerSecond);
  }

  // extra rewards

  entity.extras = getExtras(pool, txnHash.toHexString());

  entity.save();
}

function getPoolData(id: BigInt): ConvexPoolData {
  let pool = ConvexPoolData.load(id.toString());
  if (pool) {
    return pool as ConvexPoolData;
  }

  pool = new ConvexPoolData(id.toString());

  let convexBoosterContract = ConvexBooster.bind(ConvexBoosterAddress);
  let poolInfo = convexBoosterContract.try_poolInfo(id);
  if (poolInfo.reverted) {
    log.error("Could not load poolInfo for pool {}", [id.toString()]);
    return pool as ConvexPoolData;
  }

  pool.lpToken    = poolInfo.value.value0
  pool.token      = poolInfo.value.value1
  pool.gauge      = poolInfo.value.value2
  pool.crvRewards = poolInfo.value.value3
  pool.stash      = poolInfo.value.value4
  pool.shutdown   = poolInfo.value.value5

  pool.stashVersion = "";

  let stashAddress = Address.fromString(pool.stash.toHexString());
  if (stashAddress !== ZERO_ADDRESS) {
    // all stash versions have getName()
    let genericStashContract = ConvexExtraRewardStashV1.bind(stashAddress);
    let name = genericStashContract.try_getName();
    if (!name.reverted) {
      // TODO why is there no match() available?
      let version = name.value.substr(-4);
      // V1, V2, V3 - remove last two characters from name: ExtraRewardSta[sh]V1
      // TODO why does === not work?
      if (version.substr(0, 2) == "sh") {
        version = version.substr(-2);
      }

      pool.stashVersion = version;
    }
  }

  pool.save();

  return pool as ConvexPoolData;
}