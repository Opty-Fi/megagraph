import { log, ethereum, Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { CurvePoolX2_128 } from "../../../generated/CurvePoolX2_128/CurvePoolX2_128";
import { CurvePoolX2_256 } from "../../../generated/CurvePoolX2_256/CurvePoolX2_256";
import { CurvePoolX3_128 } from "../../../generated/CurvePoolX3_128/CurvePoolX3_128";
import { CurvePoolX3_256 } from "../../../generated/CurvePoolX3_256/CurvePoolX3_256";
import { CurvePoolX4_128 } from "../../../generated/CurvePoolX4_128/CurvePoolX4_128";
import { CurveERC20 } from "../../../generated/CurvePoolX2_128/CurveERC20";
import { CurveRegistry } from "../../../generated/CurvePoolX2_128/CurveRegistry";
import { CurveLiquidityGaugeCommon } from "../../../generated/CurvePoolX2_128/CurveLiquidityGaugeCommon";
import { CurvePoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress, toBytes } from "../../utils/converters";
import { CurveRegistryAddress, ZERO_BYTES, ZERO_BD } from "../../utils/constants";
import { getExtras } from "./extras";

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

  // balance and tokens arrays

  let balances: Array<BigDecimal> = [];
  let tokens: Array<Bytes> = [];
  for (let i = 0; i < nCoins; i++) {
    balances.push(getBalance(vault, BigInt.fromI32(i), poolType));
    tokens.push(getToken(vault, BigInt.fromI32(i), poolType));
  }
  entity.balance = balances;
  entity.tokens = tokens;

  // virtual price

  let virtualPrice: ethereum.CallResult<BigInt>;
  if (poolType === "Curve2Pool_128") {
    let contract = CurvePoolX2_128.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else if (poolType === "Curve2Pool_256") {
    let contract = CurvePoolX2_256.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else if (poolType === "Curve3Pool_128") {
    let contract = CurvePoolX3_128.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else if (poolType === "Curve3Pool_256") {
    let contract = CurvePoolX3_256.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else if (poolType === "Curve4Pool_128") {
    let contract = CurvePoolX4_128.bind(vault);
    virtualPrice = contract.try_get_virtual_price();
  } else {
    log.error("Unknown poolType {}", [poolType]);
  }
  entity.virtualPrice =
    !virtualPrice || virtualPrice.reverted ? ZERO_BD : convertBINumToDesiredDecimals(virtualPrice.value, 18);

  // extra rewards

  entity.extras = getExtras(<CurvePoolData>entity, txnHash);

  // working supply

  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    entity.workingSupply = ZERO_BD;
  } else {
    let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
    let gaugeContract = CurveLiquidityGaugeCommon.bind(gaugeAddress);
    let workingSupplyResult = gaugeContract.try_working_supply();
    if (workingSupplyResult.reverted) {
      log.warning("working_supply reverted", []);
      entity.workingSupply = ZERO_BD;
    } else {
      entity.workingSupply = convertBINumToDesiredDecimals(workingSupplyResult.value, 18);
    }
  }

  entity.save();
}

function getBalance(address: Address, coinIndex: BigInt, poolType: string): BigDecimal {
  let balance: ethereum.CallResult<BigInt>;
  let token: ethereum.CallResult<Address>;

  if (poolType === "Curve2Pool_128") {
    let contract = CurvePoolX2_128.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve2Pool_256") {
    let contract = CurvePoolX2_256.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve3Pool_128") {
    let contract = CurvePoolX3_128.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve3Pool_256") {
    let contract = CurvePoolX3_256.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve4Pool_128") {
    let contract = CurvePoolX4_128.bind(address);
    balance = contract.try_balances(coinIndex);
    token = contract.try_coins(coinIndex);
  } else {
    return ZERO_BD;
  }

  if (balance.reverted) {
    log.warning(
      '{} ({}) balances({}) reverted',
      [poolType, address.toHexString(), coinIndex.toString()]
    )
  } else if (token.reverted) {
    log.warning(
      '{} ({}) coins({}) reverted',
      [poolType, address.toHexString(), coinIndex.toString()]
    )
  } else {
    let tokenContract = CurveERC20.bind(token.value);
    let decimal = tokenContract.try_decimals();
    return decimal.reverted
      ? convertBINumToDesiredDecimals(balance.value, 18) // ETH
      : convertBINumToDesiredDecimals(balance.value, decimal.value);
  }
  return ZERO_BD;
}

function getToken(address: Address, coinIndex: BigInt, poolType: string): Bytes {
  let token: ethereum.CallResult<Address>;

  if (poolType === "Curve2Pool_128") {
    let contract = CurvePoolX2_128.bind(address);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve2Pool_256") {
    let contract = CurvePoolX2_256.bind(address);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve3Pool_128") {
    let contract = CurvePoolX3_128.bind(address);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve3Pool_256") {
    let contract = CurvePoolX3_256.bind(address);
    token = contract.try_coins(coinIndex);
  } else if (poolType === "Curve4Pool_128") {
    let contract = CurvePoolX4_128.bind(address);
    token = contract.try_coins(coinIndex);
  } else {
    return ZERO_BYTES;
  }
  return token.reverted ? ZERO_BYTES : toBytes(token.value.toHex());
}
