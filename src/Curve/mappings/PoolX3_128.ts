import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  CurvePoolX3_128,
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
  RemoveLiquidityOne as RemoveLiquidityOneEvent,
  RemoveLiquidityImbalance as RemoveLiquidityImbalanceEvent,
  TokenExchange as TokenExchangeEvent,
  TokenExchangeUnderlying as TokenExchangeUnderlyingEvent,
} from "../../../generated/CurvePoolX3_128/CurvePoolX3_128";
import { CurveERC20 } from "../../../generated/Curve/CurveERC20";
import { CurvePoolData } from "../../../generated/schema";
import { ZERO_BD, ZERO_BYTES } from "../../utils/constants";
import { convertBINumToDesiredDecimals, toBytes } from "../../utils/converters";
import { getExtras } from "./extras";
import { getWorkingSupply } from "./shared";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
  );
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOneEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
  );
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalanceEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
  );
}

export function handleTokenExchange(event: TokenExchangeEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
  );
}

export function handleTokenExchangeUnderlying(event: TokenExchangeUnderlyingEvent): void {
  handlePoolEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // vault
    "Curve3Pool_128",
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

  let contract = CurvePoolX3_128.bind(vault);

  // balance and tokens arrays

  let balances: Array<BigDecimal> = [];
  let tokens: Array<Bytes> = [];
  for (let i = 0; i < 3; i++) {
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

  entity.workingSupply = getWorkingSupply(vault, blockNumber);

  entity.save();
}
