import { Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { toAddress, toBytes } from "./converters";

export const ZERO_BI: BigInt = BigInt.fromString("0");
export const ZERO_BD: BigDecimal = BigDecimal.fromString("0");
export const ZERO_ADDRESS: Address = toAddress("0x0000000000000000000000000000000000000000");

export const AaveV1_POOL_PROVIDER_ADDRESS: Address = toAddress("0x24a42fD28C976A61Df5D00D0599C34c4f90748c8");

export const AaveV2_POOL_PROVIDER_ADDRESS: Address = toAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");
export const AaveV2_DATA_PROVIDER_INDEX: Bytes = toBytes("0x0100000000000000000000000000000000000000000000000000000000000000");

export const CurveV1_N_COINS_CURVE2POOL = 2;
export const CurveV1_N_COINS_CURVE3POOL = 3;
export const CurveV1_N_COINS_CURVE4POOL = 4;

export const DForce_dDAI: Address = toAddress("0x02285AcaafEB533e03A7306C55EC031297df9224");
export const DForce_dDAI_Staking: Address = toAddress("0xD2fA07cD6Cd4A5A96aa86BacfA6E50bB3aaDBA8B");
export const DForce_dUSDC: Address = toAddress("0x16c9cF62d8daC4a38FB50Ae5fa5d51E9170F3179");
export const DForce_dUSDC_Staking: Address = toAddress("0xB71dEFDd6240c45746EC58314a01dd6D833fD3b5");
export const DForce_dUSDT: Address = toAddress("0x868277d475E0e475E38EC5CdA2d9C83B5E1D9fc8");
export const DForce_dUSDT_Staking: Address = toAddress("0x324EebDAa45829c6A8eE903aFBc7B61AF48538df");

export const Harvest_POOL: Address = toAddress("0x15d3A64B2d5ab9E152F16593Cdebc4bB165B5B4A");
export const Harvest_VAULT: Address = toAddress("0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C");
