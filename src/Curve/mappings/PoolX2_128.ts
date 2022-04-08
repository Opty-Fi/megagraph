import { Address, BigDecimal, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import {
  CurvePoolX2_128,
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityOne as RemoveLiquidityOneEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurvePoolX2_128/CurvePoolX2_128";
import { CurveERC20 } from "../../../generated/Curve/CurveERC20";
import { CurveRegistry } from "../../../generated/Curve/CurveRegistry";
import { CurveLiquidityGaugeCommon } from "../../../generated/Curve/CurveLiquidityGaugeCommon";
import { CurvePoolData } from "../../../generated/schema";
import { CurveRegistryAddress, CURVE_REGISTRY_START_BLOCK, ZERO_BD, ZERO_BYTES } from "../../utils/constants";
import { convertBINumToDesiredDecimals, convertBytesToAddress, toBytes } from "../../utils/converters";
import { getExtras } from "./extras";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
  );
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOneEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve2Pool_128",
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

  let contract = CurvePoolX2_128.bind(vault);

  // balance and tokens arrays

  let balances: Array<BigDecimal> = [];
  let tokens: Array<Bytes> = [];
  for (let i = 0; i < 2; i++) {
    let balanceResult = contract.try_balances(BigInt.fromI32(i));
    let tokenResult = contract.try_coins(BigInt.fromI32(i));

    let balance = ZERO_BD;
    let token = ZERO_BYTES;

    if (balanceResult.reverted) {
      log.warning("{} ({}) balances({}) reverted", [poolType, vault.toHexString(), `${i}`]);
    } else if (tokenResult.reverted) {
      log.warning("{} ({}) coins({}) reverted", [poolType, vault.toHexString(), `${i}`]);
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

    balances.push(balance);
    tokens.push(token);
  }
  entity.balance = balances;
  entity.tokens = tokens;

  // virtual price

  let virtualPriceResult = contract.try_get_virtual_price();
  entity.virtualPrice =
    !virtualPriceResult || virtualPriceResult.reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(virtualPriceResult.value, 18);

  // extra rewards

  entity.extras = getExtras(<CurvePoolData>entity, txnHash);

  // working supply

  entity.workingSupply = ZERO_BD;
  if (blockNumber > CURVE_REGISTRY_START_BLOCK) {
    let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
    let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(entity.vault));
    if (getGaugesResult.reverted) {
      log.warning("get_gauges reverted", []);
    } else {
      let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
      let gaugeContract = CurveLiquidityGaugeCommon.bind(gaugeAddress);
      let workingSupplyResult = gaugeContract.try_working_supply();
      if (workingSupplyResult.reverted) {
        log.warning("working_supply reverted", []);
      } else {
        entity.workingSupply = convertBINumToDesiredDecimals(workingSupplyResult.value, 18);
      }
    }
  }

  entity.save();
}
