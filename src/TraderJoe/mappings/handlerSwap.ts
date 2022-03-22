import { Address, BigDecimal, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { TraderJoeSwapData, TraderJoeSwapPair } from "../../../generated/schema";
import { TraderJoeJoePair as PairTemplate } from "../../../generated/templates";
import { TraderJoeJoePair as PairContract } from "../../../generated/templates/TraderJoeJoePair/TraderJoeJoePair";
import { TraderJoeERC20 as ERC20Contract } from "../../../generated/templates/TraderJoeJoePair/TraderJoeERC20";
import {
  TraderJoeJoeFactory as JoeFactoryContract,
  TraderJoeJoeFactory,
} from "../../../generated/TraderJoeJoeFactory/TraderJoeJoeFactory";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import {
  JOE_BAR_ADDRESS,
  JOE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
  ZERO_BD,
  JOE_WAVAX_ADDRESS,
  WAVAX_ADDRESS,
  JOE_WAVAX_STABLE_PAIRS,
  JOE_USDT_ADDRESS,
  JOE_WHITELIST,
  JOE_FACTORY_ADDRESS,
} from "../../utils/constants";

/*
 * AVAX price is calculated by getting weighted average of stable-coin pairs.
 */
export function getAVAXPrice(): BigDecimal {
  let total_weight = ZERO_BD;
  let sum_price = ZERO_BD;

  for (let i = 0; i < JOE_WAVAX_STABLE_PAIRS.length; ++i) {
    let pair_address = JOE_WAVAX_STABLE_PAIRS[i];
    let pair = TraderJoeSwapPair.load(pair_address);

    if (pair != null) {
      let price = _getAvaxPrice(pair);
      let weight = _getAvaxReserve(pair);

      total_weight = total_weight.plus(weight);
      sum_price = sum_price.plus(price.times(weight));
      log.debug("getAvaxPrice, address: {}, price: {}, weight: {}", [pair.id, price.toString(), weight.toString()]);
    }
  }
  // div by 0
  let avax_price = total_weight.equals(ZERO_BD) ? ZERO_BD : sum_price.div(total_weight);
  return avax_price;
}
// returns avax price given e.g. avax-usdt or avax-dai pair
function _getAvaxPrice(pair: TraderJoeSwapPair | null): BigDecimal {
  if (pair == null) {
    return ZERO_BD;
  }
  let avax = convertBytesToAddress(pair.token0Address) == WAVAX_ADDRESS ? pair.token1Price : pair.token0Price;
  return avax;
}

// returns avax reserves given e.g. avax-usdt or avax-dai pair
function _getAvaxReserve(pair: TraderJoeSwapPair | null): BigDecimal {
  if (pair == null) {
    return ZERO_BD;
  }
  let avax = convertBytesToAddress(pair.token0Address) == WAVAX_ADDRESS ? pair.reserve0 : pair.reserve1;
  return avax;
}

export function getAVAXRate(address: Address): BigDecimal {
  if (address == WAVAX_ADDRESS) {
    return BigDecimal.fromString("1");
  }
  let factoryContract = TraderJoeJoeFactory.bind(JOE_FACTORY_ADDRESS);

  // TODO: This is slow, and this function is called quite often.
  // What could we do to improve this?
  for (let i = 0; i < JOE_WHITELIST.length; ++i) {
    // TODO: Cont. This would be a good start, by avoiding multiple calls to getPair...
    let pairAddress = factoryContract.getPair(address, Address.fromString(JOE_WHITELIST[i]));

    if (pairAddress != ZERO_ADDRESS) {
      let pair = TraderJoeSwapPair.load(pairAddress.toHex());
      if (pair.token0Address.toHexString() === address.toHexString()) {
        return pair.token1Price.times(pair.token1DerivedAVAX as BigDecimal); // return token1 per our token * AVAX per token 1
      }
      if (pair.token1Address.toHexString() == address.toHexString()) {
        return pair.token0Price.times(pair.token0DerivedAVAX as BigDecimal); // return token0 per our token * AVAX per token 0
      }
    }
  }

  return ZERO_BD; // nothing was found return 0
}
/*
 * Get price of token in USD.
 */
export function getUSDRate(address: Address, avaxPrice: BigDecimal): BigDecimal {
  if (address == JOE_USDT_ADDRESS) {
    return BigDecimal.fromString("1");
  }

  let avaxRate = getAVAXRate(address);

  return avaxRate.times(avaxPrice);
}
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
    pair.token0Price = ZERO_BD;
    pair.token1Price = ZERO_BD;
    pair.reserve0 = ZERO_BD;
    pair.reserve1 = ZERO_BD;
    pair.token0DerivedAVAX = ZERO_BD;
    pair.token0DerivedUSD = ZERO_BD;
    pair.token1DerivedAVAX = ZERO_BD;
    pair.token1DerivedUSD = ZERO_BD;

    pair.save();
  }

  return pair as TraderJoeSwapPair;
}

export function handlePool(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  pair: Address,
  token0: Address,
  token1: Address,
  param3: BigInt,
): void {
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
  sender: Address,
  to: Address,
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
  let token0Vol = token0Out.plus(token0In);
  let token1Vol = token1Out.plus(token1In);

  let avaxPrice = getAVAXPrice();
  let price0 = pair.token0DerivedAVAX.times(avaxPrice);
  let price1 = pair.token1DerivedAVAX.times(avaxPrice);

  let derivedAvax = pair.token1DerivedAVAX
    .times(token1Vol)
    .plus(pair.token0DerivedAVAX.times(token0Vol))
    .div(BigDecimal.fromString("2"));

  let derivedVolumeUSD = derivedAvax.times(avaxPrice);
  /*
  if (JOE_WHITELIST.includes(pair.token0Address.toHex()) && JOE_WHITELIST.includes(pair.token1Address.toHex())) {
    volumeUSD = token0Vol.times(price0).plus(token1Vol).times(price1).div(BigDecimal.fromString("2"));
  } else if (
    JOE_WHITELIST.includes(pair.token0Address.toHex()) &&
    !JOE_WHITELIST.includes(pair.token1Address.toHex())
  ) {
    volumeUSD = token0Vol.times(price0);
  } else if (
    !JOE_WHITELIST.includes(pair.token0Address.toHex()) &&
    JOE_WHITELIST.includes(pair.token1Address.toHex())
  ) {
    volumeUSD = token1Vol.times(price1);
  }
  entity.volumeUSD = volumeUSD;
  */
  entity.volumeUSD = derivedVolumeUSD;
  entity.pair = pair.id;
  entity.save();
}
