import { Address, BigInt, Bytes, BigDecimal, ByteArray, log } from "@graphprotocol/graph-ts";
import {
  PutCollateral,
  TakeCollateral,
  Borrow,
  Repay,
  Liquidate,
  AlphaHomoraV2HomoraBank,
} from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2HomoraBank";
import { AlphaHomoraV2ERC20 } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2ERC20";
import { AlphaHomoraV2LpToken } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2LpToken";
import { AlphaHomoraV2CyToken } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2CyToken";
import { AlphaHomoraV2MasterChef } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2MasterChef";
import { AlphaHomoraV2MasterChefPNG } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2MasterChefPNG";
import { AlphaHomoraV2BoostedMasterChef } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2BoostedMasterChef";
import { AlphaHomoraV2BonusTokenRewarder } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2BonusTokenRewarder";
import { AlphaHomoraV2WMasterChef as wChefContract } from "../../../generated/AlphaHomoraV2HomoraBank/AlphaHomoraV2WMasterChef";
import {
  AlphaHomoraV2WMasterChef,
  AlphaHomoraV2FarmData,
  AlphaHomoraV2LpPair,
  AlphaHomoraV2LendData,
  AlphaHomoraV2Token,
  AlphaHomoraV2CreamToken,
} from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_ADDRESS, HOMORA_BANK_ADDRESS } from "../../utils/constants";

/*
handle put/take collateral on homora bank contract: event.params.id encoded from pool id and joePerShare at the time of the minting of the erc1155 token representing a position
  - can use event.params.id w homora bank function 'decodeId' to get the pool id, as well as the underlying LP token from any of the wMasterChefContracts

*/
export function getOrCreateToken(tokenAddress: string): AlphaHomoraV2Token | null {
  let tokenEntity = AlphaHomoraV2Token.load(tokenAddress);
  if (!tokenEntity) {
    tokenEntity = new AlphaHomoraV2Token(tokenAddress);
    let contract = AlphaHomoraV2ERC20.bind(Address.fromString(tokenAddress.toString()));
    let decimals = 18; // fallback
    let decimalsResult = contract.try_decimals();
    if (decimalsResult.reverted) {
      log.warning("decimals() reverted", []);
    } else {
      decimals = decimalsResult.value;
    }
    decimals = BigInt.fromI32(decimals).toI32();
    let symbol = "";
    let symbolResult = contract.try_symbol();
    if (symbolResult.reverted) {
      log.warning("symbol() reverted", []);
    } else {
      symbol = symbolResult.value;
    }
    tokenEntity.decimals = decimals;
    tokenEntity.symbol = symbol;
    tokenEntity.save();
  }
  return tokenEntity;
}

function getOrCreateWMasterChef(wMasterChefAddress: string): AlphaHomoraV2WMasterChef | null {
  let wChef = AlphaHomoraV2WMasterChef.load(wMasterChefAddress);
  if (!wChef) {
    wChef = new AlphaHomoraV2WMasterChef(wMasterChefAddress);
    let wmChefContract = wChefContract.bind(Address.fromString(wMasterChefAddress));
    let chefCall = wmChefContract.try_chef();
    if (!chefCall.reverted) {
      wChef.chef = chefCall.value.toHexString();
      wChef.save();
    }
  }
  return wChef;
}

function getOrCreateLpToken(lpTokenAddress: string, pid: i32, wMasterChefAddress: string): AlphaHomoraV2LpPair | null {
  let lpToken = AlphaHomoraV2LpPair.load(lpTokenAddress);
  if (!lpToken) {
    lpToken = new AlphaHomoraV2LpPair(lpTokenAddress);
    let lpTokenContract = AlphaHomoraV2LpToken.bind(Address.fromString(lpTokenAddress));
    let token0Call = lpTokenContract.try_token0();
    let token1Call = lpTokenContract.try_token1();
    let exchNameCall = lpTokenContract.try_name();
    let factoryAddressCall = lpTokenContract.try_factory();
    if (!token0Call.reverted && !token1Call.reverted && !exchNameCall.reverted && !factoryAddressCall.reverted) {
      let token0 = getOrCreateToken(token0Call.value.toHexString());
      let token1 = getOrCreateToken(token1Call.value.toHexString());
      lpToken.token0 = token0.id;
      lpToken.token1 = token1.id;
      lpToken.name = token0.symbol + "/" + token1.symbol;
      lpToken.exchange = exchNameCall.value;
      lpToken.pid = pid;
      lpToken.factory = factoryAddressCall.value.toHexString();
      lpToken.wMasterChef = getOrCreateWMasterChef(wMasterChefAddress).id;
      lpToken.save();
    }
  }
  return lpToken;
}

export function getOrCreateCyToken(crTokenAddress: string): AlphaHomoraV2CreamToken | null {
  let crToken = AlphaHomoraV2CreamToken.load(crTokenAddress);
  if (!crToken) {
    crToken = new AlphaHomoraV2CreamToken(crTokenAddress);
    let crTokenContract = AlphaHomoraV2CyToken.bind(Address.fromString(crTokenAddress));
    let underlyingAddressCall = crTokenContract.try_underlying();
    if (!underlyingAddressCall.reverted) {
      let token = getOrCreateToken(underlyingAddressCall.value.toHexString());
      crToken.underlying = token.id;
      crToken.save();
    }
  }
  return crToken;
}

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
      farmData.pendingRewardtoken = convertBINumToDesiredDecimals(userInfoCall.value.value0, 18)
        .times(convertBINumToDesiredDecimals(poolInfo.value3, 18))
        .minus(convertBINumToDesiredDecimals(userInfoCall.value.value1, 18));
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
      if (poolInfoCall.value.value4 != ZERO_ADDRESS) {
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

function saveJoePoolBoostedInfo(
  farmData: AlphaHomoraV2FarmData,
  pid: i32,
  wChefId: string,
  chefAddress: string,
  block: BigInt,
  timestamp: BigInt,
): void {
  let chef = AlphaHomoraV2BoostedMasterChef.bind(Address.fromString(chefAddress));
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
    farmData.pid = pid;
    farmData.lpToken = getOrCreateLpToken(poolInfo.value0.toHexString(), pid, chefAddress).id;
    farmData.poolAccRewardTokenPerShare = convertBINumToDesiredDecimals(poolInfo.value2, 18);
    farmData.lastRewardTimestamp = poolInfo.value4;
    farmData.rewardToken = "0x60781c2586d68229fde47564546784ab3faca982";
    farmData.bonusToken = ZERO_ADDRESS.toHexString();
    farmData.poolAlloc = poolInfo.value1;
    farmData.totalAlloc = totalAllocCall.value;
    farmData.rewardTokenPerSec = convertBINumToDesiredDecimals(rewardPerSecondCall.value, 18);
    farmData.lpLocked = convertBINumToDesiredDecimals(userInfoCall.value.value0, 18);
    farmData.pendingRewardtoken = convertBINumToDesiredDecimals(pendingTokensCall.value.value0, 18);
    farmData.pendingBonusToken = BigDecimal.fromString("0");
    farmData.poolAccBonusTokenPerShare = BigDecimal.fromString("0");
    farmData.bonusTokenPerSec = BigDecimal.fromString("0");
    farmData.blockNumber = block;
    farmData.timestamp = timestamp;
    farmData.wMasterChef = wChefId;
    farmData.save();
  }
}

export function handlePutCollateral(event: PutCollateral): void {
  if (event.params.id.toHexString() == "0x0") {
    return;
  }
  let farmData = new AlphaHomoraV2FarmData(event.transaction.hash.toHexString());
  let wmChefContract = wChefContract.bind(event.params.token);
  let pidCall = wmChefContract.try_decodeId(event.params.id); // use erc1155Id
  let lpTokenCall = wmChefContract.try_getUnderlyingToken(event.params.id);
  if (!pidCall.reverted && !lpTokenCall.reverted) {
    let pid = pidCall.value.value0.toI32();
    let lpToken = getOrCreateLpToken(lpTokenCall.value.toHexString(), pid, event.params.token.toHexString());
    let wChef = getOrCreateWMasterChef(event.params.token.toHexString());
    if (!wChef) {
      return;
    }
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
    }
    if (wChef.id == "0xab80758cec0a69a49ed1c9b3f114cf98118643f0") {
      saveJoePoolBoostedInfo(
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
  if (event.params.id.toHexString() == "0x0") {
    return;
  }
  let farmData = new AlphaHomoraV2FarmData(event.transaction.hash.toHexString());
  let wmChefContract = wChefContract.bind(event.params.token);
  let pidCall = wmChefContract.try_decodeId(event.params.id); // use erc1155Id
  let lpTokenCall = wmChefContract.try_getUnderlyingToken(event.params.id);
  if (!pidCall.reverted && !lpTokenCall.reverted) {
    let pid = pidCall.value.value0.toI32();
    let lpToken = getOrCreateLpToken(lpTokenCall.value.toHexString(), pid, event.params.token.toHexString());
    let wChef = getOrCreateWMasterChef(event.params.token.toHexString());
    if (!wChef) {
      return;
    }
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
  let feeBPSCall = homoraBankContract.try_feeBps()
  if (!crTokenAddressCall.reverted && !feeBPSCall.reverted) {
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
      alphaLendData.feeBPS = convertBINumToDesiredDecimals(feeBPSCall.value,4)
      alphaLendData.blockNumber = event.block.number;
      alphaLendData.timestamp = event.block.timestamp;
      alphaLendData.save();
    }
  }
}

export function handleRepay(event: Repay): void {
  let homoraBankContract = AlphaHomoraV2HomoraBank.bind(HOMORA_BANK_ADDRESS);
  let underlyingDecimals = 18;
  let crTokenAddressCall = homoraBankContract.try_banks(event.params.token);
  underlyingDecimals = getOrCreateToken(event.params.token.toHexString()).decimals;
  let feeBPSCall = homoraBankContract.try_feeBps()
  if (!crTokenAddressCall.reverted && !feeBPSCall.reverted) {
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
      alphaLendData.feeBPS = convertBINumToDesiredDecimals(feeBPSCall.value,4)
      alphaLendData.blockNumber = event.block.number;
      alphaLendData.timestamp = event.block.timestamp;
      alphaLendData.save();
    }
  }
}

export function handleLiquidate(event: Liquidate): void {
  let homoraBankContract = AlphaHomoraV2HomoraBank.bind(HOMORA_BANK_ADDRESS);
  let crTokenAddressCall = homoraBankContract.try_banks(event.params.debtToken);
  let underlyingDecimals = 18;
  underlyingDecimals = getOrCreateToken(event.params.debtToken.toHexString()).decimals;
  let feeBPSCall = homoraBankContract.try_feeBps()
  if (!crTokenAddressCall.reverted && !feeBPSCall.reverted) {
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
      alphaLendData.feeBPS = convertBINumToDesiredDecimals(feeBPSCall.value,4)
      alphaLendData.blockNumber = event.block.number;
      alphaLendData.timestamp = event.block.timestamp;
      alphaLendData.save();
    }
  }
}
