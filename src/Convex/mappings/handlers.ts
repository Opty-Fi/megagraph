import { log, Bytes, BigDecimal, BigInt, Address } from  "@graphprotocol/graph-ts";
import { ConvexBaseRewardsPool } from "../../../generated/ConvexBooster/ConvexBaseRewardsPool";
import { ConvexBooster } from "../../../generated/ConvexBooster/ConvexBooster";
import { ConvexCurvePool } from "../../../generated/ConvexBooster/ConvexCurvePool";
import { ConvexCurveRegistry } from "../../../generated/ConvexBooster/ConvexCurveRegistry";
import { ConvexERC20 } from "../../../generated/ConvexBooster/ConvexERC20";
import { ConvexExtraRewardStashV1 } from "../../../generated/ConvexBooster/ConvexExtraRewardStashV1";
import { ConvexUniswapV2Pair } from "../../../generated/ConvexBooster/ConvexUniswapV2Pair";
import { ConvexPoolData, ConvexTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
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
  let lpTokenAddress = Address.fromString(pool.lpToken.toHexString());
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

  let rewardsContract = ConvexBaseRewardsPool.bind(Address.fromString(pool.crvRewards.toHexString()));
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

  // TODO can we remove these prices here (and use the SushiSwap subgraph instead?

  // crvPrice - CRV price in USD (via SushiSwap)
  // cvxPrice - CVX price in USD (via SushiSwap)

  // https://ethereum.stackexchange.com/questions/91441/how-can-you-get-the-price-of-token-on-uniswap-using-solidity/94173
  // we use SushiSwap (same interface as UniswapV2), because there are no more CRV and CVX pools on UniswapV2 (only V3)

  let usdcWethPairContract = ConvexUniswapV2Pair.bind(Address.fromString('0x397ff1542f962076d0bfe58ea045ffa2d347aca0'));
  let wethCrvPairContract = ConvexUniswapV2Pair.bind(Address.fromString('0x58dc5a51fe44589beb22e8ce67720b5bc5378009'));
  let cvxWethPairContract = ConvexUniswapV2Pair.bind(Address.fromString('0x05767d9ef41dc40689678ffca0608878fb3de906'));

  let res = usdcWethPairContract.try_getReserves();
  if (res.reverted) {
    log.warning("Could not get price for WETH", []);
  } else {
    let res0 = res.value.value0;
    let res1 = res.value.value1;
    let wethPrice = res0.divDecimal(res1.toBigDecimal()).times(BigDecimal.fromString("1_000_000_000_000"));

    res = wethCrvPairContract.try_getReserves();
    if (!res.reverted) {
      res0 = res.value.value0;
      res1 = res.value.value1;
      let crvPrice = res0.divDecimal(res1.toBigDecimal()).times(wethPrice);
      entity.crvPrice = crvPrice;
    }

    res = cvxWethPairContract.try_getReserves();
    if (!res.reverted) {
      res0 = res.value.value0;
      res1 = res.value.value1;
      let cvxPrice = res1.divDecimal(res0.toBigDecimal()).times(wethPrice);
      entity.cvxPrice = cvxPrice;
    }
  }

  // TODO extra rewards

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