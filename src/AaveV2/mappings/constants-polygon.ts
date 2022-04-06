import { Address, Bytes } from "@graphprotocol/graph-ts";
import { toAddress, toBytes } from "../../utils/converters";

export let AaveV2_POOL_PROVIDER_ADDRESS: Address = toAddress("0xd05e3E715d945B59290df0ae8eF85c1BdB684744");
export let AaveV2_DATA_PROVIDER_INDEX: Bytes = toBytes(
  "0x0100000000000000000000000000000000000000000000000000000000000000",
);
