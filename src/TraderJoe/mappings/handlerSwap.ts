import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { TraderJoeSwapData, TraderJoeSwapPair } from "../../../generated/schema";
import { TraderJoeJoePair as PairTemplate } from "../../../generated/templates";
import { TraderJoeJoePair as PairContract } from "../../../generated/templates/TraderJoeJoePair/TraderJoeJoePair";
import { TraderJoeERC20 as ERC20Contract } from "../../../generated/templates/TraderJoeJoePair/TraderJoeERC20";

import { convertBINumToDesiredDecimals } from "../../utils/converters";

function updatePairTokens(pair: TraderJoeSwapPair, token0: Address, token1: Address): TraderJoeSwapPair {
  let tokenAddress = token0 == null ? token1 : token0;

  let tokenContract = ERC20Contract.bind(tokenAddress);
  let tokenSymbolResult = tokenContract.try_symbol();
  if (tokenSymbolResult.reverted) {
    log.warning("try_symbol() {} reverted", [tokenAddress.toHex()]);
  } else {
    if (token0 != null) {
      pair.token0Symbol = tokenSymbolResult.value;
    } else {
      pair.token1Symbol = tokenSymbolResult.value;
    }
  }
  let tokenDecimalsResult = tokenContract.try_decimals();
  if (tokenDecimalsResult.reverted) {
    log.warning("try_symbol() token0 reverted", []);
  } else {
    if (token0 != null) {
      pair.token0Decimals = BigInt.fromI32(tokenDecimalsResult.value);
    } else {
      pair.token1Decimals = BigInt.fromI32(tokenDecimalsResult.value);
    }
  }
  return pair;
}
export function getPair(address: Address, block: ethereum.Block = null): TraderJoeSwapPair | null {
  let pair = TraderJoeSwapPair.load(address.toHex());

  if (pair === null) {
    let pairContract = PairContract.bind(address);
    pair = new TraderJoeSwapPair(address.toHex());

    let token0AddresResult = pairContract.try_token0();
    if (token0AddresResult.reverted) {
      log.warning("try_token0() reverted", []);
      return null;
    } else {
      pair.token0Address = token0AddresResult.value;
      pair = updatePairTokens(pair as TraderJoeSwapPair, token0AddresResult.value, null);
    }
    let token1AddresResult = pairContract.try_token1();
    if (token1AddresResult.reverted) {
      log.warning("try_token1() reverted", []);
      return null;
    } else {
      pair.token1Address = token1AddresResult.value;
      pair = updatePairTokens(pair as TraderJoeSwapPair, null, token1AddresResult.value);
    }
    pair.name = pair.token0Symbol.concat("-").concat(pair.token1Symbol);

    pair.save();
  }

  return pair as TraderJoeSwapPair;
}

export function handlePool(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, pair: Address): void {
  log.info("handling create pool. pair: {}", [pair.toHex()]);
  PairTemplate.create(pair);
}
export function handleEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  amount0In: BigInt,
  amount0Out: BigInt,
  amount1In: BigInt,
  amount1Out: BigInt,
  address: Address, // pair address
): void {
  let entity = TraderJoeSwapData.load(txnHash.toHex());
  if (!entity) entity = new TraderJoeSwapData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  let pair = getPair(address);

  let token0In = convertBINumToDesiredDecimals(amount0In, pair.token0Decimals.toI32());
  let token1In = convertBINumToDesiredDecimals(amount1In, pair.token1Decimals.toI32());
  let token0Out = convertBINumToDesiredDecimals(amount0Out, pair.token0Decimals.toI32());
  let token1Out = convertBINumToDesiredDecimals(amount1Out, pair.token1Decimals.toI32());

  // calculate volumes
  entity.token0Vol = token0Out.plus(token0In);
  entity.token1Vol = token1Out.plus(token1In);

  entity.pair = pair.id;
  entity.save();
}
