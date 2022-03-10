import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  CurveGaugeGaugeController,
  NewGauge as NewGaugeEvent,
  NewGaugeWeight as NewGaugeWeightEvent,
  VoteForGauge as VoteForGaugeEvent,
} from "../../../generated/CurveGaugeGaugeController/CurveGaugeGaugeController";
import { CurveGaugeLiquidityGaugeCommon } from "../../../generated/CurveGaugeGaugeController/CurveGaugeLiquidityGaugeCommon";
import { CurveGaugeData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_BD } from "../../utils/constants";
import { GAUGES } from "./gauges";

export function handleNewGauge(event: NewGaugeEvent): void {
  handleGaugeEntity(
    event.block.number,
    event.block.timestamp,
    event.address,
    'NewGauge',
  );
}

export function handleNewGaugeWeight(event: NewGaugeWeightEvent): void {
  handleGaugeEntity(
    event.block.number,
    event.block.timestamp,
    event.address,
    'NewGaugeWeight',
  );
}

export function handleVoteForGauge(event: VoteForGaugeEvent): void {
  handleGaugeEntity(
    event.block.number,
    event.block.timestamp,
    event.address,
    'VoteForGauge',
  );
}

function handleGaugeEntity(
  blockNumber: BigInt,
  timestamp: BigInt,
  controller: Address,
  event: string,
): void {
  let gaugeControllerContract = CurveGaugeGaugeController.bind(controller);

  for (let i = 0; i < GAUGES.length; i++) {
    let gauge = GAUGES[i];
    let id = gauge.toHexString() + '-' + blockNumber.toString();
    let entity = new CurveGaugeData(id);

    entity.blockNumber = blockNumber;
    entity.blockTimestamp = timestamp;
    entity.liquidityGauge = gauge;
    entity.event = event;

    let result = gaugeControllerContract.try_gauge_relative_weight(gauge);
    if (result.reverted) {
      entity.relativeWeight = ZERO_BD;
    } else {
      entity.relativeWeight = convertBINumToDesiredDecimals(result.value, 18);
    }

    let liquidityGaugeContract = CurveGaugeLiquidityGaugeCommon.bind(gauge);
    result = liquidityGaugeContract.try_inflation_rate();
    if (result.reverted) {
      entity.inflationRate = ZERO_BD;
    } else {
      entity.inflationRate = convertBINumToDesiredDecimals(result.value, 18);
    }

    entity.save();
  }
}
