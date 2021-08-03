import {
  NewGauge as NewGaugeEvent,
  NewGaugeWeight as NewGaugeWeightEvent,
  NewTypeWeight as NewTypeWeightEvent,
  VoteForGauge as VoteForGaugeEvent,
} from "../../../generated/CurveGaugeController/CurveGaugeController";
import { handleGaugeEntity } from "./handlers";

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
    event.params.weight, // gaugeWeight
    null // totalWeight
  );
}
