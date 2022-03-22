import { TraderJoeAvaxPrice } from "../../../generated/schema";
import { Swap as SwapEvent, Sync as SyncEvent } from "../../../generated/templates/TraderJoeJoePair/TraderJoeJoePair";
import { ZERO_BD } from "../../utils/constants";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { handleEntity, getPair, getAVAXPrice, getUSDRate, getAVAXRate } from "./handlerSwap";
export function handleSwap(event: SwapEvent): void {
  handleEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.amount0In,
    event.params.amount0Out,
    event.params.amount1In,
    event.params.amount1Out,
    event.params.sender,
    event.params.to,
    event.address,
  );
}
export function handleSync(event: SyncEvent): void {
  let pair = getPair(event.address);
  if (pair == null) {
    return;
  }

  pair.reserve0 = convertBINumToDesiredDecimals(event.params.reserve0, pair.token0Decimals.toI32());
  pair.reserve1 = convertBINumToDesiredDecimals(event.params.reserve1, pair.token1Decimals.toI32());

  if (pair.reserve1.notEqual(ZERO_BD)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1);
  } else {
    pair.token0Price = ZERO_BD;
  }
  if (pair.reserve0.notEqual(ZERO_BD)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0);
  } else {
    pair.token1Price = ZERO_BD;
  }

  let entity = TraderJoeAvaxPrice.load("1");
  if (entity === null) {
    entity = new TraderJoeAvaxPrice("1");
    entity.avaxPrice = ZERO_BD;
  }
  let avaxPrice = getAVAXPrice();
  let addresToken0 = convertBytesToAddress(pair.token0Address);
  let addressToken1 = convertBytesToAddress(pair.token1Address);

  pair.token0DerivedAVAX = getAVAXRate(addresToken0);
  pair.token1DerivedAVAX = getAVAXRate(addressToken1);
  pair.token0DerivedUSD = getUSDRate(addresToken0, avaxPrice);
  pair.token1DerivedUSD = getUSDRate(addressToken1, avaxPrice);
  entity.avaxPrice = avaxPrice;
  entity.save();
  pair.save();
}
