import { Address, Bytes, BigInt, BigDecimal } from '@graphprotocol/graph-ts';

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString('0');
}

// @ts-ignore
export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1');
  let bd10 = BigDecimal.fromString('10');
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(bd10);
  }
  return bd;
}

// @ts-ignore
export function convertBINumToDesiredDecimals(value: BigInt, decimals: i32): BigDecimal {
  return value.toBigDecimal().div(exponentToBigDecimal(decimals));
}

export function toAddress(str: string): Address {
  return Address.fromString(str);
}

export function toBytes(str: string): Bytes {
  return <Bytes>Bytes.fromHexString(str);
}
