import { log, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  FulcrumToken,
  Burn as BurnEvent,
  FlashBorrow as FlashBorrowEvent,
  Mint as MintEvent,
} from "../../../generated/FulcrumTokeniDAI/FulcrumToken";
import { FulcrumTokenData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

function handleFulcrumToken(
  transactionHash: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  address: Address,
  tokenPrice: BigInt,
): void {
  let tokenContract = FulcrumToken.bind(address);

  let entity = FulcrumTokenData.load(transactionHash.toHex());
  if (entity == null) {
    entity = new FulcrumTokenData(transactionHash.toHex());
  }

  entity.transactionHash = transactionHash;
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = blockTimestamp;
  entity.address = address;

  let tried_symbol = tokenContract.try_symbol();
  if (tried_symbol.reverted) log.error("symbol() reverted", []);
  else entity.symbol = tried_symbol.value;

  log.debug("Saving Fulcrum Token {} at address {} in block {} with txHash {}", [
    tried_symbol.value,
    address.toHex(),
    blockNumber.toString(),
    transactionHash.toHex(),
  ]);

  let tried_supplyInterestRate = tokenContract.try_supplyInterestRate();
  if (tried_supplyInterestRate.reverted) log.error("supplyInterestRate() reverted", []);
  else entity.supplyInterestRate = convertBINumToDesiredDecimals(tried_supplyInterestRate.value, 20);

  let tried_borrowInterestRate = tokenContract.try_borrowInterestRate();
  if (tried_borrowInterestRate.reverted) log.error("borrowInterestRate() reverted", []);
  else entity.borrowInterestRate = convertBINumToDesiredDecimals(tried_borrowInterestRate.value, 20);

  if (tokenPrice) {
    entity.tokenPrice = convertBINumToDesiredDecimals(tokenPrice, 18);
  } else {
    let tried_tokenPrice = tokenContract.try_tokenPrice();
    if (tried_tokenPrice.reverted) log.error("tokenPrice() reverted", []);
    else entity.tokenPrice = convertBINumToDesiredDecimals(tried_tokenPrice.value, 18);
  }

  let tried_marketLiquidity = tokenContract.try_marketLiquidity();
  if (tried_marketLiquidity.reverted) log.error("marketLiquidity() reverted", []);
  else entity.marketLiquidity = convertBINumToDesiredDecimals(tried_marketLiquidity.value, 18);

  let tried_totalSupply = tokenContract.try_totalSupply();
  if (tried_totalSupply.reverted) log.error("totalSupply() reverted", []);
  else entity.totalSupply = convertBINumToDesiredDecimals(tried_totalSupply.value, 18);

  entity.save();
}

export function handleBurn(event: BurnEvent): void {
  handleFulcrumToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.price,
  );
}

export function handleFlashBorrow(event: FlashBorrowEvent): void {
  handleFulcrumToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    null, // tokenPrice
  );
}

export function handleMint(event: MintEvent): void {
  handleFulcrumToken(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address,
    event.params.price,
  );
}
