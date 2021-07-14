import { Address, Bytes } from "@graphprotocol/graph-ts";
import { toAddress, toBytes } from "./converters";

export const AaveV1_POOL_PROVIDER_ADDRESS: Address = toAddress("0x24a42fD28C976A61Df5D00D0599C34c4f90748c8");

export const AaveV2_POOL_PROVIDER_ADDRESS: Address = toAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");
export const AaveV2_DATA_PROVIDER_INDEX: Bytes = toBytes("0x0100000000000000000000000000000000000000000000000000000000000000");
