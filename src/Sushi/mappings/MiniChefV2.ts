import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiPoolData, SushiTokenData } from "../../../generated/schema";
import {
  SushiMiniChefV2,
  LogUpdatePool as LogUpdatePoolEvent,
} from "../../../generated/SushiMiniChefV2/SushiMiniChefV2";
import { SushiUniswapV2Pair } from "../../../generated/SushiMiniChefV2/SushiUniswapV2Pair";
import { SushiERC20Minimal } from "../../../generated/SushiMiniChefV2/SushiERC20Minimal";
import { SushiComplexRewarderTime } from "../../../generated/SushiMiniChefV2/SushiComplexRewarderTime";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { SushiMiniChefAddress, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handleLogUpdatePool(event: LogUpdatePoolEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}

function handlePool(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, poolId: BigInt): void {
  let entity = SushiTokenData.load(txnHash.toHex());
  if (!entity) entity = new SushiTokenData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;

  let miniChefContract = SushiMiniChefV2.bind(SushiMiniChefAddress);

  let pool = getPoolData(miniChefContract, poolId);
  entity.pool = pool.id;

  // calculate SUSHI per second

  let totalSushiPerSecond = ZERO_BD;
  let sushiPerSecondResult = miniChefContract.try_sushiPerSecond();
  if (sushiPerSecondResult.reverted) {
    log.warning("sushiPerSecond() reverted", []);
  } else {
    totalSushiPerSecond = convertBINumToDesiredDecimals(sushiPerSecondResult.value, 18);
  }

  let totalAllocPoint = ZERO_BI;
  let totalAllocPointResult = miniChefContract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoint = totalAllocPointResult.value;
  }

  let allocPoint = ZERO_BI;
  let poolInfoResult = miniChefContract.try_poolInfo(poolId);
  if (poolInfoResult.reverted) {
    log.warning("poolInfo({}) reverted", [poolId.toString()]);
  } else {
    entity.lastRewardTime = poolInfoResult.value.value1;
    allocPoint = poolInfoResult.value.value2;
  }

  if (totalAllocPoint > ZERO_BI) {
    entity.sushiPerSecond = totalSushiPerSecond.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
  }

  // calculate rewardPerSecond

  let rewarderResult = miniChefContract.try_rewarder(poolId);
  if (rewarderResult.reverted) {
    log.warning("rewarder({}) reverted", [poolId.toString()]);
  } else {
    let complexRewarderTimeContract = SushiComplexRewarderTime.bind(rewarderResult.value);
    let rewardPerSecondResult = complexRewarderTimeContract.try_rewardPerSecond();
    if (rewardPerSecondResult.reverted) {
      log.warning("rewardPerSecond() reverted", []);
    } else {
      let rewardPerSecond = convertBINumToDesiredDecimals(rewardPerSecondResult.value, 18);

      if (totalAllocPoint > ZERO_BI) {
        entity.rewardPerSecond = rewardPerSecond.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
      }
    }
  }

  // calculate reserves

  let lpTokenContract = SushiUniswapV2Pair.bind(convertBytesToAddress(pool.lpToken));
  let getReservesResult = lpTokenContract.try_getReserves();
  if (getReservesResult.reverted) {
    log.warning("lpToken={}, getReserves() reverted", [pool.lpToken.toHexString()]);
  } else {
    entity.reserve0 = convertBINumToDesiredDecimals(getReservesResult.value.value0, pool.decimals0);
    entity.reserve1 = convertBINumToDesiredDecimals(getReservesResult.value.value1, pool.decimals1);
  }

  // total and staked supply

  let getTotalSupplyResult = lpTokenContract.try_totalSupply();
  if (getTotalSupplyResult.reverted) {
    log.warning("lpToken={}, totalSupply() reverted", [pool.lpToken.toHexString()]);
  } else {
    entity.totalSupply = convertBINumToDesiredDecimals(getTotalSupplyResult.value, pool.decimals);
  }

  // all staking happens via the MiniChef, so we query its balance
  let balanceOfResult = lpTokenContract.try_balanceOf(SushiMiniChefAddress);
  if (balanceOfResult.reverted) {
    log.warning("lpToken={}, balanceOf({}) reverted", [pool.lpToken.toHexString(), SushiMiniChefAddress.toHexString()]);
  } else {
    entity.stakedSupply = convertBINumToDesiredDecimals(balanceOfResult.value, pool.decimals);
  }

  entity.save();
}

function getPoolData(miniChefContract: SushiMiniChefV2, id: BigInt): SushiPoolData {
  let pool = SushiPoolData.load(id.toString());
  if (pool) {
    return pool as SushiPoolData;
  }

  pool = new SushiPoolData(id.toString());

  let lpTokenResult = miniChefContract.try_lpToken(id);
  if (lpTokenResult.reverted) {
    log.warning("lpToken({}) reverted", [id.toString()]);
  } else {
    let lpToken = lpTokenResult.value;
    pool.lpToken = lpToken;

    let lpTokenContract = SushiUniswapV2Pair.bind(lpToken);
    let decimalsResult = lpTokenContract.try_decimals();
    if (decimalsResult.reverted) {
      log.warning("pid={}, lpToken={}, decimals() reverted", [id.toString(), lpToken.toHexString()]);
      pool.decimals = 18;
    } else {
      pool.decimals = decimalsResult.value;
    }

    let token0Result = lpTokenContract.try_token0();
    if (token0Result.reverted) {
      log.warning("pid={}, lpToken={}, token0() reverted", [id.toString(), lpToken.toHexString()]);
    } else {
      let token0 = token0Result.value;
      pool.token0 = token0;

      let token0Contract = SushiERC20Minimal.bind(convertBytesToAddress(pool.token0));
      let decimals0Result = token0Contract.try_decimals();
      if (decimals0Result.reverted) {
        log.warning("pid={}, token0={}, decimals() reverted", [id.toString(), token0.toHexString()]);
        pool.decimals0 = 18;
      } else {
        pool.decimals0 = decimals0Result.value;
      }

      let symbol0Result = token0Contract.try_symbol();
      if (symbol0Result.reverted) {
        log.warning("pid={}, token0={}, symbol() reverted", [id.toString(), token0.toHexString()]);
      } else {
        pool.symbol0 = symbol0Result.value;
      }
    }

    let token1Result = lpTokenContract.try_token1();
    if (token1Result.reverted) {
      log.warning("pid={}, lpToken={}, token1() reverted", [id.toString(), lpToken.toHexString()]);
    } else {
      let token1 = token1Result.value;
      pool.token1 = token1;

      let token1Contract = SushiERC20Minimal.bind(convertBytesToAddress(pool.token1));
      let decimals1Result = token1Contract.try_decimals();
      if (decimals1Result.reverted) {
        log.warning("pid={}, token1={}, decimals() reverted", [id.toString(), token1.toHexString()]);
        pool.decimals1 = 18;
      } else {
        pool.decimals1 = decimals1Result.value;
      }

      let symbol1Result = token1Contract.try_symbol();
      if (symbol1Result.reverted) {
        log.warning("pid={}, token1={}, symbol() reverted", [id.toString(), token1.toHexString()]);
      } else {
        pool.symbol1 = symbol1Result.value;
      }
    }
  }

  pool.save();

  return pool as SushiPoolData;
}
