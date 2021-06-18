// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get spender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class BalanceTransfer extends ethereum.Event {
  get params(): BalanceTransfer__Params {
    return new BalanceTransfer__Params(this);
  }
}

export class BalanceTransfer__Params {
  _event: BalanceTransfer;

  constructor(event: BalanceTransfer) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _fromBalanceIncrease(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _toBalanceIncrease(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get _fromIndex(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get _toIndex(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class BurnOnLiquidation extends ethereum.Event {
  get params(): BurnOnLiquidation__Params {
    return new BurnOnLiquidation__Params(this);
  }
}

export class BurnOnLiquidation__Params {
  _event: BurnOnLiquidation;

  constructor(event: BurnOnLiquidation) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _fromBalanceIncrease(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _fromIndex(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class InterestRedirectionAllowanceChanged extends ethereum.Event {
  get params(): InterestRedirectionAllowanceChanged__Params {
    return new InterestRedirectionAllowanceChanged__Params(this);
  }
}

export class InterestRedirectionAllowanceChanged__Params {
  _event: InterestRedirectionAllowanceChanged;

  constructor(event: InterestRedirectionAllowanceChanged) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class InterestStreamRedirected extends ethereum.Event {
  get params(): InterestStreamRedirected__Params {
    return new InterestStreamRedirected__Params(this);
  }
}

export class InterestStreamRedirected__Params {
  _event: InterestStreamRedirected;

  constructor(event: InterestStreamRedirected) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _redirectedBalance(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _fromBalanceIncrease(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _fromIndex(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class MintOnDeposit extends ethereum.Event {
  get params(): MintOnDeposit__Params {
    return new MintOnDeposit__Params(this);
  }
}

export class MintOnDeposit__Params {
  _event: MintOnDeposit;

  constructor(event: MintOnDeposit) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _fromBalanceIncrease(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _fromIndex(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Redeem extends ethereum.Event {
  get params(): Redeem__Params {
    return new Redeem__Params(this);
  }
}

export class Redeem__Params {
  _event: Redeem;

  constructor(event: Redeem) {
    this._event = event;
  }

  get _from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _fromBalanceIncrease(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _fromIndex(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class RedirectedBalanceUpdated extends ethereum.Event {
  get params(): RedirectedBalanceUpdated__Params {
    return new RedirectedBalanceUpdated__Params(this);
  }
}

export class RedirectedBalanceUpdated__Params {
  _event: RedirectedBalanceUpdated;

  constructor(event: RedirectedBalanceUpdated) {
    this._event = event;
  }

  get _targetAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _targetBalanceIncrease(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _targetIndex(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _redirectedBalanceAdded(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _redirectedBalanceRemoved(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class AaveV1Asusd extends ethereum.SmartContract {
  static bind(address: Address): AaveV1Asusd {
    return new AaveV1Asusd("AaveV1Asusd", address);
  }

  UINT_MAX_VALUE(): BigInt {
    let result = super.call("UINT_MAX_VALUE", "UINT_MAX_VALUE():(uint256)", []);

    return result[0].toBigInt();
  }

  try_UINT_MAX_VALUE(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "UINT_MAX_VALUE",
      "UINT_MAX_VALUE():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  allowance(owner: Address, spender: Address): BigInt {
    let result = super.call(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );

    return result[0].toBigInt();
  }

  try_allowance(owner: Address, spender: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  approve(spender: Address, value: BigInt): boolean {
    let result = super.call("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(value)
    ]);

    return result[0].toBoolean();
  }

  try_approve(spender: Address, value: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(value)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  balanceOf(_user: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(_user)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(_user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(_user)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  decreaseAllowance(spender: Address, subtractedValue: BigInt): boolean {
    let result = super.call(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_decreaseAllowance(
    spender: Address,
    subtractedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getInterestRedirectionAddress(_user: Address): Address {
    let result = super.call(
      "getInterestRedirectionAddress",
      "getInterestRedirectionAddress(address):(address)",
      [ethereum.Value.fromAddress(_user)]
    );

    return result[0].toAddress();
  }

  try_getInterestRedirectionAddress(
    _user: Address
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getInterestRedirectionAddress",
      "getInterestRedirectionAddress(address):(address)",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getRedirectedBalance(_user: Address): BigInt {
    let result = super.call(
      "getRedirectedBalance",
      "getRedirectedBalance(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );

    return result[0].toBigInt();
  }

  try_getRedirectedBalance(_user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRedirectedBalance",
      "getRedirectedBalance(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserIndex(_user: Address): BigInt {
    let result = super.call("getUserIndex", "getUserIndex(address):(uint256)", [
      ethereum.Value.fromAddress(_user)
    ]);

    return result[0].toBigInt();
  }

  try_getUserIndex(_user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUserIndex",
      "getUserIndex(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  increaseAllowance(spender: Address, addedValue: BigInt): boolean {
    let result = super.call(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_increaseAllowance(
    spender: Address,
    addedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isTransferAllowed(_user: Address, _amount: BigInt): boolean {
    let result = super.call(
      "isTransferAllowed",
      "isTransferAllowed(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_user),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_isTransferAllowed(
    _user: Address,
    _amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isTransferAllowed",
      "isTransferAllowed(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_user),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  principalBalanceOf(_user: Address): BigInt {
    let result = super.call(
      "principalBalanceOf",
      "principalBalanceOf(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );

    return result[0].toBigInt();
  }

  try_principalBalanceOf(_user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "principalBalanceOf",
      "principalBalanceOf(address):(uint256)",
      [ethereum.Value.fromAddress(_user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  totalSupply(): BigInt {
    let result = super.call("totalSupply", "totalSupply():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalSupply", "totalSupply():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  transfer(recipient: Address, amount: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_transfer(
    recipient: Address,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(sender: Address, recipient: Address, amount: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    sender: Address,
    recipient: Address,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  underlyingAssetAddress(): Address {
    let result = super.call(
      "underlyingAssetAddress",
      "underlyingAssetAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_underlyingAssetAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "underlyingAssetAddress",
      "underlyingAssetAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _addressesProvider(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _underlyingAsset(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _underlyingAssetDecimals(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get _name(): string {
    return this._call.inputValues[3].value.toString();
  }

  get _symbol(): string {
    return this._call.inputValues[4].value.toString();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AllowInterestRedirectionToCall extends ethereum.Call {
  get inputs(): AllowInterestRedirectionToCall__Inputs {
    return new AllowInterestRedirectionToCall__Inputs(this);
  }

  get outputs(): AllowInterestRedirectionToCall__Outputs {
    return new AllowInterestRedirectionToCall__Outputs(this);
  }
}

export class AllowInterestRedirectionToCall__Inputs {
  _call: AllowInterestRedirectionToCall;

  constructor(call: AllowInterestRedirectionToCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AllowInterestRedirectionToCall__Outputs {
  _call: AllowInterestRedirectionToCall;

  constructor(call: AllowInterestRedirectionToCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class BurnOnLiquidationCall extends ethereum.Call {
  get inputs(): BurnOnLiquidationCall__Inputs {
    return new BurnOnLiquidationCall__Inputs(this);
  }

  get outputs(): BurnOnLiquidationCall__Outputs {
    return new BurnOnLiquidationCall__Outputs(this);
  }
}

export class BurnOnLiquidationCall__Inputs {
  _call: BurnOnLiquidationCall;

  constructor(call: BurnOnLiquidationCall) {
    this._call = call;
  }

  get _account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _value(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class BurnOnLiquidationCall__Outputs {
  _call: BurnOnLiquidationCall;

  constructor(call: BurnOnLiquidationCall) {
    this._call = call;
  }
}

export class DecreaseAllowanceCall extends ethereum.Call {
  get inputs(): DecreaseAllowanceCall__Inputs {
    return new DecreaseAllowanceCall__Inputs(this);
  }

  get outputs(): DecreaseAllowanceCall__Outputs {
    return new DecreaseAllowanceCall__Outputs(this);
  }
}

export class DecreaseAllowanceCall__Inputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get subtractedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DecreaseAllowanceCall__Outputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class IncreaseAllowanceCall extends ethereum.Call {
  get inputs(): IncreaseAllowanceCall__Inputs {
    return new IncreaseAllowanceCall__Inputs(this);
  }

  get outputs(): IncreaseAllowanceCall__Outputs {
    return new IncreaseAllowanceCall__Outputs(this);
  }
}

export class IncreaseAllowanceCall__Inputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get addedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncreaseAllowanceCall__Outputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class MintOnDepositCall extends ethereum.Call {
  get inputs(): MintOnDepositCall__Inputs {
    return new MintOnDepositCall__Inputs(this);
  }

  get outputs(): MintOnDepositCall__Outputs {
    return new MintOnDepositCall__Outputs(this);
  }
}

export class MintOnDepositCall__Inputs {
  _call: MintOnDepositCall;

  constructor(call: MintOnDepositCall) {
    this._call = call;
  }

  get _account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class MintOnDepositCall__Outputs {
  _call: MintOnDepositCall;

  constructor(call: MintOnDepositCall) {
    this._call = call;
  }
}

export class RedeemCall extends ethereum.Call {
  get inputs(): RedeemCall__Inputs {
    return new RedeemCall__Inputs(this);
  }

  get outputs(): RedeemCall__Outputs {
    return new RedeemCall__Outputs(this);
  }
}

export class RedeemCall__Inputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class RedeemCall__Outputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }
}

export class RedirectInterestStreamCall extends ethereum.Call {
  get inputs(): RedirectInterestStreamCall__Inputs {
    return new RedirectInterestStreamCall__Inputs(this);
  }

  get outputs(): RedirectInterestStreamCall__Outputs {
    return new RedirectInterestStreamCall__Outputs(this);
  }
}

export class RedirectInterestStreamCall__Inputs {
  _call: RedirectInterestStreamCall;

  constructor(call: RedirectInterestStreamCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RedirectInterestStreamCall__Outputs {
  _call: RedirectInterestStreamCall;

  constructor(call: RedirectInterestStreamCall) {
    this._call = call;
  }
}

export class RedirectInterestStreamOfCall extends ethereum.Call {
  get inputs(): RedirectInterestStreamOfCall__Inputs {
    return new RedirectInterestStreamOfCall__Inputs(this);
  }

  get outputs(): RedirectInterestStreamOfCall__Outputs {
    return new RedirectInterestStreamOfCall__Outputs(this);
  }
}

export class RedirectInterestStreamOfCall__Inputs {
  _call: RedirectInterestStreamOfCall;

  constructor(call: RedirectInterestStreamOfCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RedirectInterestStreamOfCall__Outputs {
  _call: RedirectInterestStreamOfCall;

  constructor(call: RedirectInterestStreamOfCall) {
    this._call = call;
  }
}

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get recipient(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get sender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferOnLiquidationCall extends ethereum.Call {
  get inputs(): TransferOnLiquidationCall__Inputs {
    return new TransferOnLiquidationCall__Inputs(this);
  }

  get outputs(): TransferOnLiquidationCall__Outputs {
    return new TransferOnLiquidationCall__Outputs(this);
  }
}

export class TransferOnLiquidationCall__Inputs {
  _call: TransferOnLiquidationCall;

  constructor(call: TransferOnLiquidationCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _value(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferOnLiquidationCall__Outputs {
  _call: TransferOnLiquidationCall;

  constructor(call: TransferOnLiquidationCall) {
    this._call = call;
  }
}
