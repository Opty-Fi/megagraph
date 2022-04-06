import { Transfer as TransferEvent } from "../../../generated/TraderJoeJoeBar/TraderJoeJoeBar";
import { BigDecimal, log } from "@graphprotocol/graph-ts";
import { TraderJoeStakingData } from "../../../generated/schema";
import { TraderJoeJoeBar as JoeBarContract } from "../../../generated/TraderJoeJoeBar/TraderJoeJoeBar";

import { TraderJoeJoeToken as JoeTokenContract } from "../../../generated/TraderJoeJoeBar/TraderJoeJoeToken";
import { TraderJoeJoePair as JoePairContract } from "../../../generated/TraderJoeJoeBar/TraderJoeJoePair";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import {
  TRADER_JOE_BAR_ADDRESS,
  TRADER_JOE_TOKEN_ADDRESS,
  TRADER_JOE_USDT_PAIR_ADDRESS,
  ZERO_ADDRESS,
  ZERO_BD,
} from "../../utils/constants";

export function handleTransfer(event: TransferEvent): void {
  if (event.params.from != ZERO_ADDRESS && event.params.to != ZERO_ADDRESS) {
    log.debug("not mint or burn. tx: {}", [event.block.hash.toHex()]);
    return;
  }

  // incoming value in BigDecimal
  let valueBD = convertBINumToDesiredDecimals(event.params.value, 18);
  // if zero transfer, do nothing.
  if (valueBD.equals(ZERO_BD)) {
    log.warning("Transfer zero value!", []);
    return;
  }

  // create stake entity
  let entity = TraderJoeStakingData.load(event.transaction.hash.toHex());
  if (!entity) entity = new TraderJoeStakingData(event.transaction.hash.toHex());
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;

  // instanciate contracts
  let barContract = JoeBarContract.bind(TRADER_JOE_BAR_ADDRESS);
  let joeTokenContract = JoeTokenContract.bind(TRADER_JOE_TOKEN_ADDRESS);

  // get current Joe usdt price
  let joePrice = getJoePrice();

  // get xJoe total supply
  let totalSupply = ZERO_BD;
  let totalSupplyResult = barContract.try_totalSupply();
  if (totalSupplyResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
    totalSupply = convertBINumToDesiredDecimals(totalSupplyResult.value, 18);
  }

  // get staked Joe on xJoe
  let joeBalance = ZERO_BD;
  let joeBalanceResult = joeTokenContract.try_balanceOf(TRADER_JOE_BAR_ADDRESS);
  if (joeBalanceResult.reverted) {
    log.warning("try_balance() reverted", []);
  } else {
    joeBalance = convertBINumToDesiredDecimals(joeBalanceResult.value, 18);
  }
  // get the Joe / xJoe ratio
  let ratio = joeBalance.div(totalSupply);

  // use the ratio to get the actual Joe value of xJoe passed as parameter
  let joeQuantity = valueBD.times(ratio);

  // handle mints and burns
  if (event.params.from == ZERO_ADDRESS) {
    entity.xJoeSupply = totalSupply.plus(valueBD);
    entity.tvl = joeBalance.plus(joeQuantity);
    entity.event = "Mint";
  }
  if (event.params.to == ZERO_ADDRESS) {
    entity.xJoeSupply = totalSupply.minus(valueBD);
    entity.tvl = joeBalance.minus(joeQuantity);
    entity.event = "Burn";
  }
  entity.tvlInUSDT = entity.tvl.times(joePrice);
  entity.save();
}

function getJoePrice(): BigDecimal {
  // instanciate with the joe-usdt address to get the reserves
  let pair = JoePairContract.bind(TRADER_JOE_USDT_PAIR_ADDRESS);
  let reservesResult = pair.try_getReserves();
  if (reservesResult.reverted) {
    log.info("[getJoePrice] getReserves reverted", []);
    return ZERO_BD;
  }
  let reserves = reservesResult.value;
  if (reserves.value0.toBigDecimal().equals(ZERO_BD)) {
    log.error("[getJoePrice] USDT reserve 0", []);
    return ZERO_BD;
  }

  let usdts = convertBINumToDesiredDecimals(reserves.value1, 6);
  let joeTokens = convertBINumToDesiredDecimals(reserves.value0, 18);
  return usdts.div(joeTokens);
}
