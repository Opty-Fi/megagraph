import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  CurveGaugeController,
  NewGauge as NewGaugeEvent,
  NewGaugeWeight as NewGaugeWeightEvent,
  NewTypeWeight as NewTypeWeightEvent,
  VoteForGauge as VoteForGaugeEvent,
} from "../../../generated/CurveGaugeController/CurveGaugeController";
import { CurveGaugeData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { ZERO_ADDRESS, ZERO_BD } from "../../utils/constants";

export function handleNewGauge(event: NewGaugeEvent): void {
  handleGaugeEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // controller
    event.params.addr, // gauge
    event.params.weight, // gaugeWeight
    null // totalWeight
  );
}

export function handleNewGaugeWeight(event: NewGaugeWeightEvent): void {
  handleGaugeEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // controller
    event.params.gauge_address, // gauge
    event.params.weight, // gaugeWeight
    event.params.total_weight // totalWeight
  );
}

export function handleNewTypeWeight(event: NewTypeWeightEvent): void {
  handleGaugeEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // controller
    null, // gauge
    event.params.weight, // gaugeWeight
    event.params.total_weight // totalWeight
  );
}

export function handleVoteForGauge(event: VoteForGaugeEvent): void {
  handleGaugeEntity(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.address, // controller
    event.params.gauge_addr, // gauge
    null, // gaugeWeight
    null // totalWeight
  );
}

function handleGaugeEntity(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  controller: Address,
  gauge: Address,
  gaugeWeight: BigInt,
  totalWeight: BigInt
): void {
  let entity = CurveGaugeData.load(txnHash.toHex());
  if (!entity) entity = new CurveGaugeData(txnHash.toHex());

  log.debug("Saving Gauge Controller at {}", [ controller.toHex() ]);

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.gaugeController = controller;

  let liquidityGauge = gauge
    ? gauge
    : ZERO_ADDRESS;
  entity.liquidityGauge = liquidityGauge;

  let gaugeControllerContract = CurveGaugeController.bind(controller);
  entity.gaugeWeight = gaugeWeight
    ? convertBINumToDesiredDecimals(gaugeWeight, 18)
    : gaugeControllerContract.try_get_gauge_weight(liquidityGauge).reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(gaugeControllerContract.get_gauge_weight(liquidityGauge), 18);
  entity.totalWeight = totalWeight
    ? convertBINumToDesiredDecimals(totalWeight, 18)
    : gaugeControllerContract.try_get_total_weight().reverted
      ? ZERO_BD
      : convertBINumToDesiredDecimals(gaugeControllerContract.get_total_weight(), 18);

  entity.save();
}
