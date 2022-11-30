import { Swap as SwapEvent } from "../../../generated/templates/PangolinPair/PangolinPair";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { PangolinSwapData, PangolinSwapPair } from "../../../generated/schema";
import { PangolinPair as PairContract } from "../../../generated/templates/PangolinPair/PangolinPair";
import { PangolinERC20 as ERC20Contract } from "../../../generated/templates/PangolinPair/PangolinERC20";

import { convertBINumToDesiredDecimals } from "../../utils/converters";

export function handleSwap(event: SwapEvent): void {
  let entity = PangolinSwapData.load(event.transaction.hash.toHex());
  if (!entity) entity = new PangolinSwapData(event.transaction.hash.toHex());

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  let pair = getPair(event.address);

  let token0In = convertBINumToDesiredDecimals(event.params.amount0In, pair.token0Decimals.toI32());
  let token1In = convertBINumToDesiredDecimals(event.params.amount1In, pair.token1Decimals.toI32());
  let token0Out = convertBINumToDesiredDecimals(event.params.amount0Out, pair.token0Decimals.toI32());
  let token1Out = convertBINumToDesiredDecimals(event.params.amount1Out, pair.token1Decimals.toI32());

  // calculate volumes
  entity.token0Vol = token0Out.plus(token0In);
  entity.token1Vol = token1Out.plus(token1In);

  entity.pair = pair.id;
  entity.save();
}

export function getPair(address: Address): PangolinSwapPair | null {
  let pair = PangolinSwapPair.load(address.toHex());

  if (pair === null) {
    let pairContract = PairContract.bind(address);
    pair = new PangolinSwapPair(address.toHex());

    let token0AddresResult = pairContract.try_token0();
    if (token0AddresResult.reverted) {
      log.warning("try_token0() reverted", []);
      return null;
    } else {
      pair.token0Address = token0AddresResult.value;
      pair = updatePairTokens(pair as PangolinSwapPair, token0AddresResult.value, null);
    }
    let token1AddresResult = pairContract.try_token1();
    if (token1AddresResult.reverted) {
      log.warning("try_token1() reverted", []);
      return null;
    } else {
      pair.token1Address = token1AddresResult.value;
      pair = updatePairTokens(pair as PangolinSwapPair, null, token1AddresResult.value);
    }
    pair.name = pair.token0Symbol.concat("-").concat(pair.token1Symbol);

    pair.save();
  }

  return pair as PangolinSwapPair;
}
function updatePairTokens(pair: PangolinSwapPair, token0: Address, token1: Address): PangolinSwapPair {
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
