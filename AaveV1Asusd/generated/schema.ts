// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Approval extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Approval entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Approval entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Approval", id.toString(), this);
  }

  static load(id: string): Approval | null {
    return store.get("Approval", id) as Approval | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get spender(): Bytes {
    let value = this.get("spender");
    return value.toBytes();
  }

  set spender(value: Bytes) {
    this.set("spender", Value.fromBytes(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }
}

export class BalanceTransfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BalanceTransfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BalanceTransfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BalanceTransfer", id.toString(), this);
  }

  static load(id: string): BalanceTransfer | null {
    return store.get("BalanceTransfer", id) as BalanceTransfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _to(): Bytes {
    let value = this.get("_to");
    return value.toBytes();
  }

  set _to(value: Bytes) {
    this.set("_to", Value.fromBytes(value));
  }

  get _value(): BigInt {
    let value = this.get("_value");
    return value.toBigInt();
  }

  set _value(value: BigInt) {
    this.set("_value", Value.fromBigInt(value));
  }

  get _fromBalanceIncrease(): BigInt {
    let value = this.get("_fromBalanceIncrease");
    return value.toBigInt();
  }

  set _fromBalanceIncrease(value: BigInt) {
    this.set("_fromBalanceIncrease", Value.fromBigInt(value));
  }

  get _toBalanceIncrease(): BigInt {
    let value = this.get("_toBalanceIncrease");
    return value.toBigInt();
  }

  set _toBalanceIncrease(value: BigInt) {
    this.set("_toBalanceIncrease", Value.fromBigInt(value));
  }

  get _fromIndex(): BigInt {
    let value = this.get("_fromIndex");
    return value.toBigInt();
  }

  set _fromIndex(value: BigInt) {
    this.set("_fromIndex", Value.fromBigInt(value));
  }

  get _toIndex(): BigInt {
    let value = this.get("_toIndex");
    return value.toBigInt();
  }

  set _toIndex(value: BigInt) {
    this.set("_toIndex", Value.fromBigInt(value));
  }
}

export class BurnOnLiquidation extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save BurnOnLiquidation entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save BurnOnLiquidation entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("BurnOnLiquidation", id.toString(), this);
  }

  static load(id: string): BurnOnLiquidation | null {
    return store.get("BurnOnLiquidation", id) as BurnOnLiquidation | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _value(): BigInt {
    let value = this.get("_value");
    return value.toBigInt();
  }

  set _value(value: BigInt) {
    this.set("_value", Value.fromBigInt(value));
  }

  get _fromBalanceIncrease(): BigInt {
    let value = this.get("_fromBalanceIncrease");
    return value.toBigInt();
  }

  set _fromBalanceIncrease(value: BigInt) {
    this.set("_fromBalanceIncrease", Value.fromBigInt(value));
  }

  get _fromIndex(): BigInt {
    let value = this.get("_fromIndex");
    return value.toBigInt();
  }

  set _fromIndex(value: BigInt) {
    this.set("_fromIndex", Value.fromBigInt(value));
  }
}

export class InterestRedirectionAllowanceChanged extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save InterestRedirectionAllowanceChanged entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save InterestRedirectionAllowanceChanged entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("InterestRedirectionAllowanceChanged", id.toString(), this);
  }

  static load(id: string): InterestRedirectionAllowanceChanged | null {
    return store.get(
      "InterestRedirectionAllowanceChanged",
      id
    ) as InterestRedirectionAllowanceChanged | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _to(): Bytes {
    let value = this.get("_to");
    return value.toBytes();
  }

  set _to(value: Bytes) {
    this.set("_to", Value.fromBytes(value));
  }
}

export class InterestStreamRedirected extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save InterestStreamRedirected entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save InterestStreamRedirected entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("InterestStreamRedirected", id.toString(), this);
  }

  static load(id: string): InterestStreamRedirected | null {
    return store.get(
      "InterestStreamRedirected",
      id
    ) as InterestStreamRedirected | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _to(): Bytes {
    let value = this.get("_to");
    return value.toBytes();
  }

  set _to(value: Bytes) {
    this.set("_to", Value.fromBytes(value));
  }

  get _redirectedBalance(): BigInt {
    let value = this.get("_redirectedBalance");
    return value.toBigInt();
  }

  set _redirectedBalance(value: BigInt) {
    this.set("_redirectedBalance", Value.fromBigInt(value));
  }

  get _fromBalanceIncrease(): BigInt {
    let value = this.get("_fromBalanceIncrease");
    return value.toBigInt();
  }

  set _fromBalanceIncrease(value: BigInt) {
    this.set("_fromBalanceIncrease", Value.fromBigInt(value));
  }

  get _fromIndex(): BigInt {
    let value = this.get("_fromIndex");
    return value.toBigInt();
  }

  set _fromIndex(value: BigInt) {
    this.set("_fromIndex", Value.fromBigInt(value));
  }
}

export class MintOnDeposit extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save MintOnDeposit entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save MintOnDeposit entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("MintOnDeposit", id.toString(), this);
  }

  static load(id: string): MintOnDeposit | null {
    return store.get("MintOnDeposit", id) as MintOnDeposit | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _value(): BigInt {
    let value = this.get("_value");
    return value.toBigInt();
  }

  set _value(value: BigInt) {
    this.set("_value", Value.fromBigInt(value));
  }

  get _fromBalanceIncrease(): BigInt {
    let value = this.get("_fromBalanceIncrease");
    return value.toBigInt();
  }

  set _fromBalanceIncrease(value: BigInt) {
    this.set("_fromBalanceIncrease", Value.fromBigInt(value));
  }

  get _fromIndex(): BigInt {
    let value = this.get("_fromIndex");
    return value.toBigInt();
  }

  set _fromIndex(value: BigInt) {
    this.set("_fromIndex", Value.fromBigInt(value));
  }
}

export class Redeem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Redeem entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Redeem entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Redeem", id.toString(), this);
  }

  static load(id: string): Redeem | null {
    return store.get("Redeem", id) as Redeem | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _from(): Bytes {
    let value = this.get("_from");
    return value.toBytes();
  }

  set _from(value: Bytes) {
    this.set("_from", Value.fromBytes(value));
  }

  get _value(): BigInt {
    let value = this.get("_value");
    return value.toBigInt();
  }

  set _value(value: BigInt) {
    this.set("_value", Value.fromBigInt(value));
  }

  get _fromBalanceIncrease(): BigInt {
    let value = this.get("_fromBalanceIncrease");
    return value.toBigInt();
  }

  set _fromBalanceIncrease(value: BigInt) {
    this.set("_fromBalanceIncrease", Value.fromBigInt(value));
  }

  get _fromIndex(): BigInt {
    let value = this.get("_fromIndex");
    return value.toBigInt();
  }

  set _fromIndex(value: BigInt) {
    this.set("_fromIndex", Value.fromBigInt(value));
  }
}

export class RedirectedBalanceUpdated extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save RedirectedBalanceUpdated entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save RedirectedBalanceUpdated entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("RedirectedBalanceUpdated", id.toString(), this);
  }

  static load(id: string): RedirectedBalanceUpdated | null {
    return store.get(
      "RedirectedBalanceUpdated",
      id
    ) as RedirectedBalanceUpdated | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _targetAddress(): Bytes {
    let value = this.get("_targetAddress");
    return value.toBytes();
  }

  set _targetAddress(value: Bytes) {
    this.set("_targetAddress", Value.fromBytes(value));
  }

  get _targetBalanceIncrease(): BigInt {
    let value = this.get("_targetBalanceIncrease");
    return value.toBigInt();
  }

  set _targetBalanceIncrease(value: BigInt) {
    this.set("_targetBalanceIncrease", Value.fromBigInt(value));
  }

  get _targetIndex(): BigInt {
    let value = this.get("_targetIndex");
    return value.toBigInt();
  }

  set _targetIndex(value: BigInt) {
    this.set("_targetIndex", Value.fromBigInt(value));
  }

  get _redirectedBalanceAdded(): BigInt {
    let value = this.get("_redirectedBalanceAdded");
    return value.toBigInt();
  }

  set _redirectedBalanceAdded(value: BigInt) {
    this.set("_redirectedBalanceAdded", Value.fromBigInt(value));
  }

  get _redirectedBalanceRemoved(): BigInt {
    let value = this.get("_redirectedBalanceRemoved");
    return value.toBigInt();
  }

  set _redirectedBalanceRemoved(value: BigInt) {
    this.set("_redirectedBalanceRemoved", Value.fromBigInt(value));
  }
}

export class Transfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transfer entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transfer entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transfer", id.toString(), this);
  }

  static load(id: string): Transfer | null {
    return store.get("Transfer", id) as Transfer | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get to(): Bytes {
    let value = this.get("to");
    return value.toBytes();
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }
}