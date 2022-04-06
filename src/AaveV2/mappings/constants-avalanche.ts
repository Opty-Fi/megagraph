import { Address, Bytes } from "@graphprotocol/graph-ts";
import { toAddress, toBytes } from "../../utils/converters";

export let AaveV2_POOL_PROVIDER_ADDRESS: Address = toAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f");
export let AaveV2_DATA_PROVIDER_INDEX: Bytes = toBytes(
  "0x0100000000000000000000000000000000000000000000000000000000000000",
);
