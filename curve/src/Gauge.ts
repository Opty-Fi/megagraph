import {
  Gauge,
  NewTypeWeight,
  NewGaugeWeight,
  VoteForGauge,
  NewGauge
} from "../generated/Gauge/Gauge"
import { GaugeControllerData } from "../generated/schema"
import {
  convertBINumToDesiredDecimals,
  zeroBD,
  zeroAddress
} from "./utils/converters"

export function handleNewTypeWeight(event: NewTypeWeight): void {
  let data = GaugeControllerData.load(event.transaction.hash.toHexString())
  if (!data) {
    data = new GaugeControllerData(event.transaction.hash.toHexString())
  }

  data.blockNumber = event.block.number
  data.timestamp = event.block.timestamp
  data.controller = event.address
  data.gauge = zeroAddress()
  data.gaugeWeight = zeroBD()
  data.totalGaugeWeight = convertBINumToDesiredDecimals(
    event.params.total_weight,
    18
  )
  data.save()
}

export function handleNewGaugeWeight(event: NewGaugeWeight): void {
  let data = GaugeControllerData.load(event.transaction.hash.toHexString())
  if (!data) {
    data = new GaugeControllerData(event.transaction.hash.toHexString())
  }
  data.blockNumber = event.block.number
  data.timestamp = event.block.timestamp
  data.controller = event.address
  data.gauge = event.params.gauge_address
  data.gaugeWeight = convertBINumToDesiredDecimals(event.params.weight, 18)
  data.totalGaugeWeight = convertBINumToDesiredDecimals(
    event.params.total_weight,
    18
  )
  data.save()
}

export function handleVoteForGauge(event: VoteForGauge): void {
  let contract = Gauge.bind(event.address)
  let data = GaugeControllerData.load(event.transaction.hash.toHexString())
  if (!data) {
    data = new GaugeControllerData(event.transaction.hash.toHexString())
  }

  data.blockNumber = event.block.number
  data.timestamp = event.block.timestamp
  data.controller = event.address
  data.gauge = event.params.gauge_addr
  let weight = contract.try_get_gauge_weight(event.params.gauge_addr)
  data.gaugeWeight = !weight.reverted
    ? convertBINumToDesiredDecimals(weight.value, 18)
    : zeroBD()
  data.totalGaugeWeight = zeroBD()
  data.save()
}

export function handleNewGauge(event: NewGauge): void {
  let contract = Gauge.bind(event.address)
  let data = GaugeControllerData.load(event.transaction.hash.toHexString())
  if (!data) {
    data = new GaugeControllerData(event.transaction.hash.toHexString())
  }
  data.blockNumber = event.block.number
  data.timestamp = event.block.timestamp
  data.controller = event.address
  data.gauge = event.params.addr
  data.gaugeWeight = convertBINumToDesiredDecimals(event.params.weight, 18)
  let totalWeight = contract.try_get_total_weight()

  data.totalGaugeWeight = !totalWeight.reverted
    ? convertBINumToDesiredDecimals(totalWeight.value, 18)
    : zeroBD()
  data.save()
}