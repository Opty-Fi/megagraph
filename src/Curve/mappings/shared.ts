import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { CurveRegistry } from "../../../generated/Curve/CurveRegistry";
import { CurveLiquidityGaugeCommon } from "../../../generated/Curve/CurveLiquidityGaugeCommon";
import { CurveRegistryAddress, CURVE_REGISTRY_START_BLOCK, ZERO_BD } from "../../utils/constants";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";

export function getWorkingSupply(vault: Address, blockNumber: BigInt): BigDecimal {
  if (blockNumber.lt(CURVE_REGISTRY_START_BLOCK)) {
    return ZERO_BD;
  }

  let CurveRegistryContract = CurveRegistry.bind(CurveRegistryAddress);
  let getGaugesResult = CurveRegistryContract.try_get_gauges(convertBytesToAddress(vault));
  if (getGaugesResult.reverted) {
    log.warning("get_gauges reverted", []);
    return ZERO_BD;
  } else {
    let gaugeAddress = convertBytesToAddress(getGaugesResult.value.value0[0]);
    let gaugeContract = CurveLiquidityGaugeCommon.bind(gaugeAddress);
    let workingSupplyResult = gaugeContract.try_working_supply();
    if (workingSupplyResult.reverted) {
      log.warning("working_supply reverted", []);
      return ZERO_BD;
    } else {
      return convertBINumToDesiredDecimals(workingSupplyResult.value, 18);
    }
  }
}
