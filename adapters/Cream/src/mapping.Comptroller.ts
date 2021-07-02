import { ethereum, log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Comptroller,
  CompSpeedUpdated as CompSpeedUpdatedEvent,
} from "../generated/Comptroller/Comptroller";
import { CCapableErc20Delegate } from "./CCapableErc20Delegate";
import { CreamToken } from "../generated/schema";
import { convertBINumToDesiredDecimals } from "./converters";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  let comptrollerContract = Comptroller.bind(event.address);
  let tokenContract = CCapableErc20Delegate.bind(event.params.cToken);

  let entity = CreamToken.load(event.transaction.hash.toHex());
  if (!entity) entity = new CreamToken(event.transaction.hash.toHex());

  let underlyingAssetDecimals: i32;
  let underlyingAsset = tokenContract.try_underlying();
  if (underlyingAsset.reverted) log.error("underlying() reverted", []);
  else {
    let underlyingAssetContract = CCapableErc20Delegate.bind(underlyingAsset.value);
    if (!underlyingAssetContract) log.error("No underlyingAsset at {}", [ underlyingAsset.value.toHex() ]);
    else {
      let tried_underlyingAssetDecimals = underlyingAssetContract.try_decimals();
      if (tried_underlyingAssetDecimals.reverted) log.error("decimals() reverted", []);
      else underlyingAssetDecimals = tried_underlyingAssetDecimals.value;
    }
  }

  entity.transactionHash = event.transaction.hash;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.address = event.params.cToken;
  entity.symbol = tokenContract.symbol();

  if (event.params.newSpeed) {
    entity.compSpeeds = convertBINumToDesiredDecimals(event.params.newSpeed, 18);
  } else {
    let tried_compSpeeds = comptrollerContract.try_compSpeeds(event.params.cToken);
    if (tried_compSpeeds.reverted) log.error("compSpeeds() reverted", []);
    else entity.compSpeeds = convertBINumToDesiredDecimals(tried_compSpeeds.value, 18);
  }
  
  let tried_borrowIndex = tokenContract.try_borrowIndex();
  if (tried_borrowIndex.reverted) log.error("borrowIndex() reverted", []);
  else entity.borrowIndex = tried_borrowIndex.value;

  let tried_borrowRatePerBlock = tokenContract.try_borrowRatePerBlock();
  if (tried_borrowRatePerBlock.reverted) log.error("borrowRatePerBlock() reverted", []);
  else entity.borrowRatePerBlock = convertBINumToDesiredDecimals(tried_borrowRatePerBlock.value, 18);

  let tried_supplyRatePerBlock = tokenContract.try_supplyRatePerBlock();
  if (tried_supplyRatePerBlock.reverted) log.error("supplyRatePerBlock() reverted", []);
  else entity.supplyRatePerBlock = convertBINumToDesiredDecimals(tried_supplyRatePerBlock.value, 18);
  
  let tried_exchangeRateStored = tokenContract.try_exchangeRateStored();
  if (tried_exchangeRateStored.reverted) log.error("exchangeRateStored() reverted", []);
  else entity.exchangeRateStored = convertBINumToDesiredDecimals(tried_exchangeRateStored.value, 10 + underlyingAssetDecimals);

  let tried_getCash = tokenContract.try_getCash();
  if (tried_getCash.reverted) log.error("getCash() reverted", []);
  else entity.totalCash = convertBINumToDesiredDecimals(tried_getCash.value, underlyingAssetDecimals);

  let tried_totalBorrows = tokenContract.try_totalBorrows();
  if (tried_totalBorrows.reverted) log.error("totalBorrows() reverted", []);
  else entity.totalBorrows = convertBINumToDesiredDecimals(tried_totalBorrows.value, underlyingAssetDecimals);

  let tried_totalSupply = tokenContract.try_totalSupply();
  if (tried_totalSupply.reverted) log.error("totalSupply() reverted", []);
  else entity.totalSupply = tried_totalSupply.value;

  let tried_totalReserves = tokenContract.try_totalReserves();
  if (tried_totalReserves.reverted) log.error("totalReserves() reverted", []);
  else entity.totalReserves = tried_totalReserves.value;
  
  entity.save();
}
