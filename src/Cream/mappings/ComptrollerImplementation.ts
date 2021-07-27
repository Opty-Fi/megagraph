<<<<<<< HEAD
import { log } from "@graphprotocol/graph-ts";
import {
  CreamComptrollerImplementation,
  CompSpeedUpdated as CompSpeedUpdatedEvent,
} from "../../../generated/CreamComptrollerImplementation/CreamComptrollerImplementation";
import { CreamToken } from "../../../generated/CreamTokencrDAI/CreamToken";
import { CreamTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  let comptrollerContract = CreamComptrollerImplementation.bind(event.address);
  let tokenContract = CreamToken.bind(event.params.cToken);

  let entity = CreamTokenData.load(event.transaction.hash.toHex());
  if (!entity) entity = new CreamTokenData(event.transaction.hash.toHex());

  // @ts-ignore
  let underlyingAssetDecimals: i32;
  let underlyingAsset = tokenContract.try_underlying();
  if (underlyingAsset.reverted) log.error("underlying() reverted", []);
  else {
    let underlyingAssetContract = CreamToken.bind(underlyingAsset.value);
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
  entity.symbol = tokenContract.try_symbol().reverted ? null : tokenContract.symbol();

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
  else entity.totalSupply = convertBINumToDesiredDecimals(tried_totalSupply.value, underlyingAssetDecimals);

  let tried_totalReserves = tokenContract.try_totalReserves();
  if (tried_totalReserves.reverted) log.error("totalReserves() reverted", []);
  else entity.totalReserves = convertBINumToDesiredDecimals(tried_totalReserves.value, underlyingAssetDecimals);
  
  entity.save();
=======
import { CompSpeedUpdated as CompSpeedUpdatedEvent } from "../../../generated/CreamComptrollerImplementation/CreamComptrollerImplementation";
import { handleEntity } from "./handlers";

export function handleCompSpeedUpdated(event: CompSpeedUpdatedEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.newSpeed,
    event.params.cToken,
    null, // borrowIndex
    null, // totalBorrows
    null, // totalReserves
  );
>>>>>>> 20b71bb8e26a1fb67637ae7f87c4f168b6424f0c
}
