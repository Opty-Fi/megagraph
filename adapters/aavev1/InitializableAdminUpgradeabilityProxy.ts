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

export class AdminChanged extends ethereum.Event {
  get params(): AdminChanged__Params {
    return new AdminChanged__Params(this);
  }
}

export class AdminChanged__Params {
  _event: AdminChanged;

  constructor(event: AdminChanged) {
    this._event = event;
  }

  get previousAdmin(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newAdmin(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Upgraded extends ethereum.Event {
  get params(): Upgraded__Params {
    return new Upgraded__Params(this);
  }
}

export class Upgraded__Params {
  _event: Upgraded;

  constructor(event: Upgraded) {
    this._event = event;
  }

  get implementation(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class InitializableAdminUpgradeabilityProxy extends ethereum.SmartContract {
  static bind(address: Address): InitializableAdminUpgradeabilityProxy {
    return new InitializableAdminUpgradeabilityProxy(
      "InitializableAdminUpgradeabilityProxy",
      address
    );
  }

  admin(): Address {
    let result = super.call("admin", "admin():(address)", []);

    return result[0].toAddress();
  }

  try_admin(): ethereum.CallResult<Address> {
    let result = super.tryCall("admin", "admin():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  implementation(): Address {
    let result = super.call("implementation", "implementation():(address)", []);

    return result[0].toAddress();
  }

  try_implementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "implementation",
      "implementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class DefaultCall extends ethereum.Call {
  get inputs(): DefaultCall__Inputs {
    return new DefaultCall__Inputs(this);
  }

  get outputs(): DefaultCall__Outputs {
    return new DefaultCall__Outputs(this);
  }
}

export class DefaultCall__Inputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DefaultCall__Outputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class AdminCall extends ethereum.Call {
  get inputs(): AdminCall__Inputs {
    return new AdminCall__Inputs(this);
  }

  get outputs(): AdminCall__Outputs {
    return new AdminCall__Outputs(this);
  }
}

export class AdminCall__Inputs {
  _call: AdminCall;

  constructor(call: AdminCall) {
    this._call = call;
  }
}

export class AdminCall__Outputs {
  _call: AdminCall;

  constructor(call: AdminCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class ChangeAdminCall extends ethereum.Call {
  get inputs(): ChangeAdminCall__Inputs {
    return new ChangeAdminCall__Inputs(this);
  }

  get outputs(): ChangeAdminCall__Outputs {
    return new ChangeAdminCall__Outputs(this);
  }
}

export class ChangeAdminCall__Inputs {
  _call: ChangeAdminCall;

  constructor(call: ChangeAdminCall) {
    this._call = call;
  }

  get newAdmin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ChangeAdminCall__Outputs {
  _call: ChangeAdminCall;

  constructor(call: ChangeAdminCall) {
    this._call = call;
  }
}

export class ImplementationCall extends ethereum.Call {
  get inputs(): ImplementationCall__Inputs {
    return new ImplementationCall__Inputs(this);
  }

  get outputs(): ImplementationCall__Outputs {
    return new ImplementationCall__Outputs(this);
  }
}

export class ImplementationCall__Inputs {
  _call: ImplementationCall;

  constructor(call: ImplementationCall) {
    this._call = call;
  }
}

export class ImplementationCall__Outputs {
  _call: ImplementationCall;

  constructor(call: ImplementationCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _logic(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _admin(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class Initialize1Call extends ethereum.Call {
  get inputs(): Initialize1Call__Inputs {
    return new Initialize1Call__Inputs(this);
  }

  get outputs(): Initialize1Call__Outputs {
    return new Initialize1Call__Outputs(this);
  }
}

export class Initialize1Call__Inputs {
  _call: Initialize1Call;

  constructor(call: Initialize1Call) {
    this._call = call;
  }

  get _logic(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class Initialize1Call__Outputs {
  _call: Initialize1Call;

  constructor(call: Initialize1Call) {
    this._call = call;
  }
}

export class UpgradeToCall extends ethereum.Call {
  get inputs(): UpgradeToCall__Inputs {
    return new UpgradeToCall__Inputs(this);
  }

  get outputs(): UpgradeToCall__Outputs {
    return new UpgradeToCall__Outputs(this);
  }
}

export class UpgradeToCall__Inputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpgradeToCall__Outputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }
}

export class UpgradeToAndCallCall extends ethereum.Call {
  get inputs(): UpgradeToAndCallCall__Inputs {
    return new UpgradeToAndCallCall__Inputs(this);
  }

  get outputs(): UpgradeToAndCallCall__Outputs {
    return new UpgradeToAndCallCall__Outputs(this);
  }
}

export class UpgradeToAndCallCall__Inputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class UpgradeToAndCallCall__Outputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }
}
