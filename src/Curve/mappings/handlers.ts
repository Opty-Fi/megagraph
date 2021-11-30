import { log, ethereum, Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { CurvePoolX2 } from "../../../generated/CurvePoolX2/CurvePoolX2";
import { CurvePoolX3 } from "../../../generated/CurvePoolX3/CurvePoolX3";
import { CurvePoolX4 } from "../../../generated/CurvePoolX4/CurvePoolX4";
import { CurveERC20 } from "../../../generated/CurvePoolX2/CurveERC20";
import { CurvePoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, toBytes } from "../../utils/converters";
import { ZERO_BYTES, ZERO_BD } from "../../utils/constants";

export function handlePoolEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  vault: Address,
  nCoins: number,
  poolType: string,
): void {
  let entity = CurvePoolData.load(txnHash.toHex());
  if (!entity) entity = new CurvePoolData(txnHash.toHex());

  log.debug("Saving {} at {}", [poolType, vault.toHex()]);

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.vault = vault;

  let balances: Array<BigDecimal> = [];
  let tokens: Array<Bytes> = [];
  for (let i = 0; i < nCoins; i++) {
    balances.push(getBalance(vault, BigInt.fromI32(i), poolType));
    tokens.push(getToken(vault, BigInt.fromI32(i), poolType));
  }
  entity.balance = balances;
  entity.tokens = tokens;

  let virtualPrice: ethereum.CallResult<BigInt>;
  if (poolType === "Curve3Pool") {
    let contract = CurvePoolX3.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else {
    log.error("Unknown poolType {}", [poolType]);
  }
  entity.virtualPrice =
    !virtualPrice || virtualPrice.reverted ? ZERO_BD : convertBINumToDesiredDecimals(virtualPrice.value, 18);

  entity.save();
}

function getBalance(address: Address, coinIndex: BigInt, poolType: string): BigDecimal {
  let balance: ethereum.CallResult<BigInt>;
  let token: ethereum.CallResult<Address>;

  if (poolType === "Curve3Pool") {
    let contract = CurvePoolX3.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else {
    return ZERO_BD;
  }

  if (!balance.reverted && !token.reverted) {
    let tokenContract = CurveERC20.bind(token.value);
    let decimal = tokenContract.try_decimals();
    return decimal.reverted
      ? balance.value.toBigDecimal()
      : convertBINumToDesiredDecimals(balance.value, decimal.value);
  }
  return ZERO_BD;
}

function getToken(address: Address, coinIndex: BigInt, poolType: string): Bytes {
  let token: ethereum.CallResult<Address>;

  if (poolType === "Curve3Pool") {
    let contract = CurvePoolX3.bind(address);
    token = contract.try_coins(coinIndex);
  } else {
    return ZERO_BYTES;
  }
  return token.reverted ? ZERO_BYTES : toBytes(token.value.toHex());
}
