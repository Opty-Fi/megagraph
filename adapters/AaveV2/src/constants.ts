import { Address, Bytes } from "@graphprotocol/graph-ts";
import { toAddress, toBytes } from "./converters";

export const POOL_PROVIDER_ADDRESS: Address = toAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");
export const DATA_PROVIDER_INDEX: Bytes = toBytes("0x0100000000000000000000000000000000000000000000000000000000000000");
