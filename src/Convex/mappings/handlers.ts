import { log, Bytes, BigDecimal, BigInt, Address } from  "@graphprotocol/graph-ts";
import { ConvexBaseRewardsPool } from "../../../generated/ConvexBooster/ConvexBaseRewardsPool";
import { ConvexBooster } from "../../../generated/ConvexBooster/ConvexBooster";
import { ConvexCurvePool } from "../../../generated/ConvexBooster/ConvexCurvePool";
import { ConvexCurveRegistry } from "../../../generated/ConvexBooster/ConvexCurveRegistry";
import { ConvexERC20 } from "../../../generated/ConvexBooster/ConvexERC20";
import { ConvexExtraRewardStashV1 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV1";
import { ConvexExtraRewardStashV2 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV2";
import { ConvexExtraRewardStashV3 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV3";
import { ConvexExtraRewardStashV31 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV31";
import { ConvexExtraRewardStashV32 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV32";
import { ConvexPoolData, ConvexTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { ConvexBoosterAddress, CurveRegistryAddress, ZERO_ADDRESS, ZERO_BD } from "../../utils/constants";

export function handlePoolEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt
): void {
  let entity = ConvexTokenData.load(txnHash.toHex());
  if (!entity) entity = new ConvexTokenData(txnHash.toHex());

  entity.blockNumber = blockNumber;
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

  switch (pool.stashVersion) {
    case "V1":
      let stashContractV1 = ConvexExtraRewardStashV1.bind(convertBytesToAddress(pool.stash));
      let tokenInfo = stashContractV1.try_tokenInfo();
      if (!tokenInfo.reverted) {
        let rewardToken = tokenInfo.value.value0;
        let rewardAddress = tokenInfo.value.value1;
        let lastActive = tokenInfo.value.value2;

        // TODO add to array
      }
      break;
    case "V2":
      let stashContractV2 = ConvexExtraRewardStashV2.bind(convertBytesToAddress(pool.stash));
      let tokenCountV2 = stashContractV2.try_tokenCount();
      if (!tokenCountV2.reverted) {
        for (let i = 0; i < tokenCountV2.value.toI32(); i++) {
          let tokenInfo = stashContractV2.try_tokenInfo(BigInt.fromI32(i));
          if (!tokenInfo.reverted) {
            let rewardToken = tokenInfo.value.value0;
            let rewardAddress = tokenInfo.value.value1;
            let lastActive = tokenInfo.value.value2;
          }

          // TODO add to array
        }
      }
      break;
    case "V3":
      let stashContractV3 = ConvexExtraRewardStashV3.bind(convertBytesToAddress(pool.stash));
      let tokenCountV3 = stashContractV3.try_tokenCount();
      if (!tokenCountV3.reverted) {
        for (let i = 0; i < tokenCountV3.value.toI32(); i++) {
          let tokenInfo = stashContractV3.try_tokenInfo(BigInt.fromI32(i));
          if (!tokenInfo.reverted) {
            let rewardToken = tokenInfo.value.value0;
            let rewardAddress = tokenInfo.value.value1;
          }

          // TODO add to array
        }
      }
      break;
    case "V3.1":
    case "V3.2":
      let stashContractV31 = ConvexExtraRewardStashV31.bind(convertBytesToAddress(pool.stash));
      let tokenCountV31 = stashContractV31.try_tokenCount();
      if (!tokenCountV31.reverted) {
        for (let i = 0; i < tokenCountV31.value.toI32(); i++) {
          let tokenList = stashContractV31.try_tokenList(BigInt.fromI32(i));
          if (!tokenList.reverted) {
            let tokenInfo = stashContractV31.try_tokenInfo(tokenList.value);
            if (!tokenInfo.reverted) {
              let rewardToken = tokenInfo.value.value0;
              let rewardAddress = tokenInfo.value.value1;

              // TODO add to array
            }
          }
        }
      }
    default:
      log.error("Unexpected stashVersion {}", [pool.stashVersion])
  }

  entity.save();
}

// https://docs.convexfinance.com/convexfinanceintegration/cvx-minting
let cliffSize = BigDecimal.fromString("100_000"); // new cliff every 100k tokens
let cliffCount = BigDecimal.fromString("1000");
let maxSupply = BigDecimal.fromString("100_000_000"); // 100m tokens

function getCvxMintAmount(crvEarned: BigDecimal): BigDecimal {
  // first get total supply
  let cvxToken = ConvexERC20.bind(Address.fromString('0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B'));
  let supply = cvxToken.try_totalSupply();
  if (supply.reverted) {
    return ZERO_BD;
  }
  let totalSupply = convertBINumToDesiredDecimals(supply.value, 18)

  // get current cliff
  let currentCliff = totalSupply.div(cliffSize);

  // if current cliff is under the max
  if (currentCliff.lt(cliffCount)) {
    // get remaining cliffs
    let remaining = cliffCount.minus(currentCliff)

    // multiply ratio of remaining cliffs to total cliffs against amount CRV received
    let cvxEarned = crvEarned.times(remaining).div(cliffCount)

    // double check we have not gone over the max supply
    let amountTillMax = maxSupply.minus(totalSupply)
    if (cvxEarned.gt(amountTillMax)) {
      cvxEarned = amountTillMax
    }
    return cvxEarned
  }
  return ZERO_BD;
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