import { Address, BigInt, Bytes, BigDecimal, ByteArray } from "@graphprotocol/graph-ts";
import {
  PutCollateral,
  TakeCollateral,
  Borrow,
  Repay,
  Liquidate,
  AlphaHomoraV2HomoraBank,
} from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2HomoraBank";
import { AlphaHomoraV2CyToken } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2CyToken";
import { AlphaHomoraV2MasterChef } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2MasterChef";
import { AlphaHomoraV2MasterChefPNG } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2MasterChefPNG";
import { AlphaHomoraV2BonusTokenRewarder } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2BonusTokenRewarder";
import {
  AlphaHomoraV2WMasterChef,
  AlphaHomoraV2FarmData,
  AlphaHomoraV2LpPair,
  AlphaHomoraV2LendData,
} from "../../../generated/schema";
import { getOrCreateCyToken, getOrCreateToken } from "./PoolRegistry";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_ADDRESS, HOMORA_BANK_ADDRESS } from "../../utils/constants";

function saveJoePoolInfo(
  farmData: AlphaHomoraV2FarmData,
  pid: i32,
  wChefId: string,
  chefAddress: string,
  block: BigInt,
  timestamp: BigInt,
): void {
  let chef = AlphaHomoraV2MasterChef.bind(Address.fromString(chefAddress));
  let poolInfoCall = chef.try_poolInfo(BigInt.fromI32(pid));
  let totalAllocCall = chef.try_totalAllocPoint();
  let rewardPerSecondCall = chef.try_joePerSec();
  let userInfoCall = chef.try_userInfo(BigInt.fromI32(pid), Address.fromString(wChefId));
  if (!poolInfoCall.reverted && !totalAllocCall.reverted && !rewardPerSecondCall.reverted && !userInfoCall.reverted) {
    let poolInfo = poolInfoCall.value;
    let lpToken = AlphaHomoraV2LpPair.load(poolInfo.value0.toHexString());
    if (lpToken) {
      farmData.pid = pid;
      farmData.lpToken = lpToken.id;
      farmData.poolAlloc = poolInfo.value1;
      farmData.totalAlloc = totalAllocCall.value;
      farmData.lastRewardTimestamp = poolInfo.value2;
      farmData.rewardToken = "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd";
      farmData.bonusToken = ZERO_ADDRESS.toHexString();
      farmData.poolAccRewardTokenPerShare = convertBINumToDesiredDecimals(poolInfo.value3, 18);
      farmData.rewardTokenPerSec = convertBINumToDesiredDecimals(rewardPerSecondCall.value, 18);
      farmData.lpLocked = convertBINumToDesiredDecimals(userInfoCall.value.value0, 18);
      farmData.pendingRewardtoken = convertBINumToDesiredDecimals(userInfoCall.value.value1, 18);
      farmData.pendingBonusToken = BigDecimal.fromString("0");
      farmData.poolAccBonusTokenPerShare = BigDecimal.fromString("0");
      farmData.bonusTokenPerSec = BigDecimal.fromString("0");
      farmData.blockNumber = block;
      farmData.timestamp = timestamp;
      farmData.wMasterChef = wChefId;
      farmData.save();
    }
  }
}

function saveJoePoolV3Info(
  farmData: AlphaHomoraV2FarmData,
  pid: i32,
  wChefId: string,
  chefAddress: string,
  block: BigInt,
  timestamp: BigInt,
): void {
  let chef = AlphaHomoraV2MasterChef.bind(Address.fromString(chefAddress));
  let poolInfoCall = chef.try_poolInfo(BigInt.fromI32(pid));
  let totalAllocCall = chef.try_totalAllocPoint();
  let rewardPerSecondCall = chef.try_joePerSec();
  let userInfoCall = chef.try_userInfo(BigInt.fromI32(pid), Address.fromString(wChefId));
  let pendingTokensCall = chef.try_pendingTokens(BigInt.fromI32(pid), Address.fromString(wChefId));
  if (
    !poolInfoCall.reverted &&
    !totalAllocCall.reverted &&
    !rewardPerSecondCall.reverted &&
    !userInfoCall.reverted &&
    !pendingTokensCall.reverted
  ) {
    let poolInfo = poolInfoCall.value;
    let lpToken = AlphaHomoraV2LpPair.load(poolInfo.value0.toHexString());
    if (lpToken) {
      farmData.pid = pid;
      farmData.lpToken = lpToken.id;
      farmData.poolAlloc = poolInfo.value3;
      farmData.totalAlloc = totalAllocCall.value;
      farmData.lastRewardTimestamp = poolInfo.value2;
      farmData.rewardToken = "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd";
      farmData.bonusToken = ZERO_ADDRESS.toHexString();
      farmData.poolAccRewardTokenPerShare = convertBINumToDesiredDecimals(poolInfo.value1, 18);
      farmData.rewardTokenPerSec = convertBINumToDesiredDecimals(rewardPerSecondCall.value, 18);
      farmData.lpLocked = convertBINumToDesiredDecimals(userInfoCall.value.value0, 18);
      farmData.pendingRewardtoken = convertBINumToDesiredDecimals(userInfoCall.value.value1, 18);
      farmData.pendingBonusToken = BigDecimal.fromString("0");
      farmData.poolAccBonusTokenPerShare = BigDecimal.fromString("0");
      farmData.bonusTokenPerSec = BigDecimal.fromString("0");
      if (pid == 45) {
        let rewarder = AlphaHomoraV2BonusTokenRewarder.bind(poolInfoCall.value.value4);
        let bonusRewardInfoCall = rewarder.try_poolInfo();
        let bonusTokenPerSecCall = rewarder.try_tokenPerSec();
        if (!bonusRewardInfoCall.reverted && !bonusTokenPerSecCall.reverted) {
          farmData.poolAccBonusTokenPerShare = convertBINumToDesiredDecimals(bonusRewardInfoCall.value.value0, 18);
          farmData.bonusTokenPerSec = convertBINumToDesiredDecimals(bonusTokenPerSecCall.value, 6);
        }
        farmData.pendingBonusToken = convertBINumToDesiredDecimals(pendingTokensCall.value.value3, 6);
        farmData.bonusToken = pendingTokensCall.value.value1.toHexString();
      }
      farmData.blockNumber = block;
      farmData.timestamp = timestamp;
      farmData.wMasterChef = wChefId;
      farmData.save();
    }
  }
}

function savePngPoolInfo(
  farmData: AlphaHomoraV2FarmData,
  pid: i32,
  wChefId: string,
  chefAddress: string,
  block: BigInt,
  timestamp: BigInt,
): void {
  let chef = AlphaHomoraV2MasterChefPNG.bind(Address.fromString(chefAddress));
  let poolInfoCall = chef.try_poolInfo(BigInt.fromI32(pid));
  let totalAllocCall = chef.try_totalAllocPoint();
  let rewardPerSecondCall = chef.try_rewardPerSecond();
  let userInfoCall = chef.try_userInfo(BigInt.fromI32(pid), Address.fromString(wChefId));
  let lpTokenCall = chef.try_lpToken(BigInt.fromI32(pid));
  let rewarderCall = chef.try_rewarder(BigInt.fromI32(pid));
  if (
    !poolInfoCall.reverted &&
    !totalAllocCall.reverted &&
    !rewardPerSecondCall.reverted &&
    !userInfoCall.reverted &&
    !lpTokenCall.reverted &&
    !rewarderCall.reverted
  ) {
    let poolInfo = poolInfoCall.value;
    let lpToken = AlphaHomoraV2LpPair.load(lpTokenCall.value.toHexString());
    if (lpToken) {
      farmData.pid = pid;
      farmData.lpToken = lpToken.id;
      farmData.poolAccRewardTokenPerShare = convertBINumToDesiredDecimals(poolInfo.value0, 18);
      farmData.lastRewardTimestamp = poolInfo.value1;
      farmData.rewardToken = "0x60781c2586d68229fde47564546784ab3faca982";
      farmData.bonusToken = ZERO_ADDRESS.toHexString();
      farmData.poolAlloc = poolInfo.value2;
      farmData.totalAlloc = totalAllocCall.value;
      farmData.rewardTokenPerSec = convertBINumToDesiredDecimals(rewardPerSecondCall.value, 18);
      farmData.lpLocked = convertBINumToDesiredDecimals(userInfoCall.value.value0, 18);
      farmData.pendingRewardtoken = convertBINumToDesiredDecimals(userInfoCall.value.value1, 18);
      farmData.pendingBonusToken = BigDecimal.fromString("0");
      farmData.poolAccBonusTokenPerShare = BigDecimal.fromString("0");
      farmData.bonusTokenPerSec = BigDecimal.fromString("0");
      farmData.blockNumber = block;
      farmData.timestamp = timestamp;
      farmData.wMasterChef = wChefId;
      farmData.save();
    }
  }
}

export function handlePutCollateral(event: PutCollateral): void {
  let farmData = new AlphaHomoraV2FarmData(event.transaction.hash.toHexString());
  let wChef = AlphaHomoraV2WMasterChef.load(event.params.token.toHexString());
  if (!wChef){
    return
  }
  if (event.params.id.toHexString() == "0x0") {
    return;
  }
  let pid = parseInt(event.params.id.toHexString().slice(0,4)) as u32
  if (pid) {
    if (wChef.id == "0x1f806f7c8ded893fd3cae279191ad7aa3798e928") {
      savePngPoolInfo(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    }
    if (wChef.id == "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00") {
      saveJoePoolV3Info(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    } else {
      saveJoePoolInfo(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    }
  }
}

export function handleTakeCollateral(event: TakeCollateral): void {
  let farmData = new AlphaHomoraV2FarmData(event.transaction.hash.toHexString());
  let wChef = AlphaHomoraV2WMasterChef.load(event.params.token.toHexString());
  if (!wChef){
    return
  }
  if (event.params.id.toHexString() == "0x0") {
    return;
  }
  let pid = parseInt(event.params.id.toHexString().slice(0,4)) as u32
  if (pid) {
    if (wChef.id == "0x1f806f7c8ded893fd3cae279191ad7aa3798e928") {
      savePngPoolInfo(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    }
    if (wChef.id == "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00") {
      saveJoePoolV3Info(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    } else {
      saveJoePoolInfo(
        farmData,
        pid,
        event.params.token.toHexString(),
        wChef.chef,
        event.block.number,
        event.block.timestamp,
      );
    }
  }
}

export function handleBorrow(event: Borrow): void {
  let homoraBankContract = AlphaHomoraV2HomoraBank.bind(HOMORA_BANK_ADDRESS);
  let crTokenAddressCall = homoraBankContract.try_banks(event.params.token);
  let underlyingDecimals = 18;
  underlyingDecimals = getOrCreateToken(event.params.token.toHexString()).decimals;
  if (!crTokenAddressCall.reverted) {
    let alphaLendData = new AlphaHomoraV2LendData(event.transaction.hash.toHexString());
    let crToken = getOrCreateCyToken(crTokenAddressCall.value.value2.toHexString());
    let crTokenContract = AlphaHomoraV2CyToken.bind(crTokenAddressCall.value.value2);
    let borrowRatePerBlock = crTokenContract.try_borrowRatePerBlock();
    let supplyRatePerBlock = crTokenContract.try_supplyRatePerBlock();
    let accountSnapshotCall = crTokenContract.try_getAccountSnapshot(HOMORA_BANK_ADDRESS);
    if (!borrowRatePerBlock.reverted && !supplyRatePerBlock.reverted && !accountSnapshotCall.reverted) {
      alphaLendData.cyToken = crToken.id;
      alphaLendData.collateral = getOrCreateToken(event.params.token.toHexString()).id;
      alphaLendData.borrowRatePerBlock = convertBINumToDesiredDecimals(borrowRatePerBlock.value, 18);
      alphaLendData.supplyRatePerBlock = convertBINumToDesiredDecimals(supplyRatePerBlock.value, 18);
      alphaLendData.borrowBalance = convertBINumToDesiredDecimals(accountSnapshotCall.value.value2, underlyingDecimals);
      alphaLendData.cyTokenExchangeRate = convertBINumToDesiredDecimals(
        accountSnapshotCall.value.value3,
        10 + underlyingDecimals,
      );
      alphaLendData.save();
    }
  }
}

export function handleRepay(event: Repay): void {
  let homoraBankContract = AlphaHomoraV2HomoraBank.bind(HOMORA_BANK_ADDRESS);
  let underlyingDecimals = 18;
  let crTokenAddressCall = homoraBankContract.try_banks(event.params.token);
  underlyingDecimals = getOrCreateToken(event.params.token.toHexString()).decimals;
  if (!crTokenAddressCall.reverted) {
    let alphaLendData = new AlphaHomoraV2LendData(event.transaction.hash.toHexString());
    let crToken = getOrCreateCyToken(crTokenAddressCall.value.value2.toHexString());
    let crTokenContract = AlphaHomoraV2CyToken.bind(crTokenAddressCall.value.value2);
    let borrowRatePerBlock = crTokenContract.try_borrowRatePerBlock();
    let supplyRatePerBlock = crTokenContract.try_supplyRatePerBlock();
    let accountSnapshotCall = crTokenContract.try_getAccountSnapshot(HOMORA_BANK_ADDRESS);
    if (!borrowRatePerBlock.reverted && !supplyRatePerBlock.reverted && !accountSnapshotCall.reverted) {
      alphaLendData.cyToken = crToken.id;
      alphaLendData.collateral = getOrCreateToken(event.params.token.toHexString()).id;
      alphaLendData.borrowRatePerBlock = convertBINumToDesiredDecimals(borrowRatePerBlock.value, 18);
      alphaLendData.supplyRatePerBlock = convertBINumToDesiredDecimals(supplyRatePerBlock.value, 18);
      alphaLendData.borrowBalance = convertBINumToDesiredDecimals(accountSnapshotCall.value.value2, underlyingDecimals);
      alphaLendData.cyTokenExchangeRate = convertBINumToDesiredDecimals(
        accountSnapshotCall.value.value3,
        10 + underlyingDecimals,
      );
      alphaLendData.save();
    }
  }
}

export function handleLiquidate(event: Liquidate): void {
  let homoraBankContract = AlphaHomoraV2HomoraBank.bind(HOMORA_BANK_ADDRESS);
  let crTokenAddressCall = homoraBankContract.try_banks(event.params.debtToken);
  let underlyingDecimals = 18;
  underlyingDecimals = getOrCreateToken(event.params.debtToken.toHexString()).decimals;
  if (!crTokenAddressCall.reverted) {
    let alphaLendData = new AlphaHomoraV2LendData(event.transaction.hash.toHexString());
    let crToken = getOrCreateCyToken(crTokenAddressCall.value.value2.toHexString());
    let crTokenContract = AlphaHomoraV2CyToken.bind(crTokenAddressCall.value.value2);
    let borrowRatePerBlock = crTokenContract.try_borrowRatePerBlock();
    let supplyRatePerBlock = crTokenContract.try_supplyRatePerBlock();
    let accountSnapshotCall = crTokenContract.try_getAccountSnapshot(HOMORA_BANK_ADDRESS);
    if (!borrowRatePerBlock.reverted && !supplyRatePerBlock.reverted && !accountSnapshotCall.reverted) {
      alphaLendData.cyToken = crToken.id;
      alphaLendData.collateral = getOrCreateToken(event.params.debtToken.toHexString()).id;
      alphaLendData.borrowRatePerBlock = convertBINumToDesiredDecimals(borrowRatePerBlock.value, 18);
      alphaLendData.supplyRatePerBlock = convertBINumToDesiredDecimals(supplyRatePerBlock.value, 18);
      alphaLendData.borrowBalance = convertBINumToDesiredDecimals(accountSnapshotCall.value.value2, underlyingDecimals);
      alphaLendData.cyTokenExchangeRate = convertBINumToDesiredDecimals(
        accountSnapshotCall.value.value3,
        10 + underlyingDecimals,
      );
      alphaLendData.save();
    }
  }
}
