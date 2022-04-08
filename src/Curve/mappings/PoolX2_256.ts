import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  CurvePoolX2_256,
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityOne as RemoveLiquidityOneEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurvePoolX2_256/CurvePoolX2_256";
import { CurveERC20 } from "../../../generated/Curve/CurveERC20";
import { CurvePoolData } from "../../../generated/schema";
import { CURVE_CALC_WITHDRAW_ONE_COIN_AMOUNT, ZERO_BD, ZERO_BYTES } from "../../utils/constants";
import { convertBINumToDesiredDecimals, toBytes } from "../../utils/converters";
import { getExtras } from "./extras";
import { getWorkingSupply } from "./shared";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOneEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_256",
  );
}

function handlePoolEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address,
  poolType: string,
): void {
  let entity = CurvePoolData.load(txnHash.toHex());
  if (!entity) entity = new CurvePoolData(txnHash.toHex());

  log.debug("Saving {} at {}", [poolType, vault.toHex()]);

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.vault = vault;

  let contract = CurvePoolX2_256.bind(vault);

  // balance, tokens and underlying per LP arrays

  let balances: Array<BigDecimal> = [];
  let tokens: Array<Bytes> = [];
  let underlyingPerLpTokens: Array<BigDecimal> = [];
  for (let i = 0; i < 4; i++) {
    let balanceResult = contract.try_balances(BigInt.fromI32(i));
    let tokenResult = contract.try_coins(BigInt.fromI32(i));
    let calcWithdrawOneCoinResult = contract.try_calc_withdraw_one_coin(
      CURVE_CALC_WITHDRAW_ONE_COIN_AMOUNT,
      BigInt.fromI32(i),
    );

    let balance = ZERO_BD;
    let token = ZERO_BYTES;
    let underlyingPerLpToken = ZERO_BD;

    if (balanceResult.reverted) {
      log.warning("{} ({}) balances({}) reverted", [poolType, vault.toHexString(), i.toString()]);
    } else if (tokenResult.reverted) {
      log.warning("{} ({}) coins({}) reverted", [poolType, vault.toHexString(), i.toString()]);
    } else {
      let tokenContract = CurveERC20.bind(tokenResult.value);
      let decimalResult = tokenContract.try_decimals();
      if (decimalResult.reverted) {
        balance = convertBINumToDesiredDecimals(balanceResult.value, 18); // ETH
      } else {
        balance = convertBINumToDesiredDecimals(balanceResult.value, decimalResult.value);
      }
      token = toBytes(tokenResult.value.toHex());
    }

    if (calcWithdrawOneCoinResult.reverted) {
      log.warning("{} ({}) calc_withdraw_one_coin({}, {}) reverted", [
        poolType,
        vault.toHexString(),
        CURVE_CALC_WITHDRAW_ONE_COIN_AMOUNT.toString(),
        i.toString(),
      ]);
    } else {
      underlyingPerLpToken = calcWithdrawOneCoinResult.value
        .toBigDecimal()
        .div(CURVE_CALC_WITHDRAW_ONE_COIN_AMOUNT.toBigDecimal());
    }

    balances.push(balance);
    tokens.push(token);
    underlyingPerLpTokens.push(underlyingPerLpToken);
  }

  entity.balance = balances;
  entity.tokens = tokens;
  entity.underlyingPerLpToken = underlyingPerLpTokens;

  // virtual price

  let virtualPriceResult = contract.try_get_virtual_price();
  entity.virtualPrice =
    !virtualPriceResult || virtualPriceResult.reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(virtualPriceResult.value, 18);

  // extra rewards

  entity.extras = getExtras(<CurvePoolData>entity, txnHash);

  // working supply

  entity.workingSupply = getWorkingSupply(vault, blockNumber);

  entity.save();
}
