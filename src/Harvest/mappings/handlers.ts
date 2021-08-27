import { log, Address, BigInt } from "@graphprotocol/graph-ts";
import { HarvestNoMintRewardPool } from "../../../generated/HarvestNoMintRewardPool/HarvestNoMintRewardPool";
import { HarvestToken as Vault } from "../../../generated/HarvestTokenfDAI/HarvestToken";
import { HarvestTokenData } from "../../../generated/schema";
import { convertToLowerCase, convertBINumToDesiredDecimals } from "../../utils/converters";
import {
  ZERO_ADDRESS,
  ZERO_BI,
  ZERO_BD,
  Harvest_POOL,
  Harvest_fDAI,
} from "../../utils/constants";

export function handleEntity(
  poolAddr: Address,
  vaultAddr: Address,
  txnHash: string,
  blockNumber: BigInt,
  timestamp: BigInt,
): void {
  let entity = HarvestTokenData.load(txnHash);
  if (!entity) {
    entity = new HarvestTokenData(txnHash);
  }
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;

  if (poolAddr == null) {
    if (
      convertToLowerCase(vaultAddr.toHex()) ==
      convertToLowerCase(Harvest_fDAI.toHex())
    ) {
      log.debug("Found fDAI, setting Pool to {}", [ Harvest_POOL.toHex() ]);
      poolAddr = Harvest_POOL;
    }
  }
  if (poolAddr != null) {
    let poolContract = HarvestNoMintRewardPool.bind(poolAddr);
    let lastUpdateTime = poolContract.try_lastUpdateTime();
    let rewardRate = poolContract.try_rewardRate();
    let rewardPerTokenStored = poolContract.try_rewardPerTokenStored();
    entity.lastUpdateTime = lastUpdateTime.reverted
      ? ZERO_BI
      : lastUpdateTime.value;
    entity.rewardRate = rewardRate.reverted
      ? ZERO_BI
      : rewardRate.value;
    entity.rewardPerTokenStored = rewardPerTokenStored.reverted
      ? ZERO_BI
      : rewardPerTokenStored.value;
    entity.pool = poolAddr;
  } else {
    entity.lastUpdateTime = ZERO_BI;
    entity.rewardRate = ZERO_BI;
    entity.rewardPerTokenStored = ZERO_BI;
    entity.pool = ZERO_ADDRESS;
  }

  if (vaultAddr == null) {
    let poolContract = HarvestNoMintRewardPool.bind(poolAddr);
    let vault = poolContract.try_lpToken();
    vaultAddr = vault.reverted
      ? null
      : vault.value;
  }
  if (vaultAddr != null) {
    let contract = Vault.bind(vaultAddr);
    let pricePerFullShare = contract.try_getPricePerFullShare();
    let underlyingBalanceWithInvestment = contract.try_underlyingBalanceWithInvestment();
    let underlyingBalanceInVault = contract.try_underlyingBalanceInVault();
    entity.pricePerFullShare = pricePerFullShare.reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(pricePerFullShare.value, contract.decimals());
    entity.underlyingBalanceWithInvestment = underlyingBalanceWithInvestment.reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(underlyingBalanceWithInvestment.value, contract.decimals());
    entity.underlyingBalanceInVault = underlyingBalanceInVault.reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(underlyingBalanceInVault.value, contract.decimals());
    entity.vault = vaultAddr;
  } else {
    entity.pricePerFullShare = ZERO_BD;
    entity.underlyingBalanceWithInvestment = ZERO_BD;
    entity.underlyingBalanceInVault = ZERO_BD;
    entity.vault = ZERO_ADDRESS;
  }

  entity.save();
}
