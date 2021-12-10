import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiKashiData, SushiPoolData, SushiTokenData } from "../../../generated/schema";
import { SushiKashiPairMediumRiskV1 } from "../../../generated/SushiKashiPairMediumRiskV1/SushiKashiPairMediumRiskV1";
import { SushiERC20Minimal } from "../../../generated/SushiKashiPairMediumRiskV1/SushiERC20Minimal";
import { SushiMiniChefV2 } from "../../../generated/SushiMiniChefV2/SushiMiniChefV2";
import { SushiComplexRewarderTime } from "../../../generated/SushiMiniChefV2/SushiComplexRewarderTime";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { SushiMiniChefAddress, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handleKashiPair(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, vault: Address): void {
  let entity = SushiKashiData.load(txnHash.toHex());
  if (!entity) entity = new SushiKashiData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.vault = vault;

  let contract = SushiKashiPairMediumRiskV1.bind(vault);

  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("symbol() reverted", []);
  } else {
    entity.symbol = symbolResult.value;
  }

  let assetResult = contract.try_asset();
  if (assetResult.reverted) {
    log.warning("asset() reverted", []);
  } else {
    entity.assetToken = assetResult.value;
  }

  let collateralResult = contract.try_collateral();
  if (collateralResult.reverted) {
    log.warning("collateral() reverted", []);
  } else {
    entity.collateralToken = collateralResult.value;
  }

  let decimals = 18; // fallback
  let decimalsResult = contract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted", []);
  } else {
    decimals = decimalsResult.value;
  }
  entity.decimals = decimals;

  let accrueInfoResult = contract.try_accrueInfo();
  if (accrueInfoResult.reverted) {
    log.warning("accrueInfo() reverted", []);
  } else {
    entity.interestPerSecond = convertBINumToDesiredDecimals(accrueInfoResult.value.value0, decimals);
  }

  let assetDecimals = 18; // fallback
  let assetContract = SushiERC20Minimal.bind(convertBytesToAddress(entity.assetToken));
  decimalsResult = assetContract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted", []);
  } else {
    assetDecimals = decimalsResult.value;
  }

  let totalAssetResult = contract.try_totalAsset();
  if (totalAssetResult.reverted) {
    log.warning("totalAsset() reverted", []);
  } else {
    entity.totalAssetBase = convertBINumToDesiredDecimals(accrueInfoResult.value.value1, assetDecimals);
  }

  entity.save();
}

export function handlePool(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, poolId: BigInt): void {
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
    pool.lpToken = lpTokenResult.value;
  }

  pool.save();

  return pool as SushiPoolData;
}
