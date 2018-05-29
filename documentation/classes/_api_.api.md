[@activitystream/asa](../README.md) > ["api"](../modules/_api_.md) > [API](../classes/_api_.api.md)

# Class: API

## Hierarchy

**API**

## Index

### Properties

* [_dispatchError](_api_.api.md#_dispatcherror)
* [_dispatchEvent](_api_.api.md#_dispatchevent)
* [batchIntervalHandler](_api_.api.md#batchintervalhandler)
* [done](_api_.api.md#done)
* [pendingSubmission](_api_.api.md#pendingsubmission)

### Methods

* [batchEvent](_api_.api.md#batchevent)
* [batchOff](_api_.api.md#batchoff)
* [batchOn](_api_.api.md#batchon)
* [override](_api_.api.md#override)
* [reset](_api_.api.md#reset)
* [submitError](_api_.api.md#submiterror)
* [submitEvent](_api_.api.md#submitevent)

---

## Properties

<a id="_dispatcherror"></a>

### `<Private>` _dispatchError

**● _dispatchError**: *[ErrorDispatcher](../modules/_api_.md#errordispatcher)* =  submitError

*Defined in api.ts:64*

___
<a id="_dispatchevent"></a>

### `<Private>` _dispatchEvent

**● _dispatchEvent**: *[EventDispatcher](../modules/_api_.md#eventdispatcher)* =  submitEvent

*Defined in api.ts:63*

___
<a id="batchintervalhandler"></a>

### `<Private>` batchIntervalHandler

**● batchIntervalHandler**: *`any`*

*Defined in api.ts:66*

___
<a id="done"></a>

### `<Private>` done

**● done**: *`boolean`* = true

*Defined in api.ts:67*

___
<a id="pendingsubmission"></a>

### `<Private>` pendingSubmission

**● pendingSubmission**: *[Event](_event_.asaevent.event.md)[]* =  []

*Defined in api.ts:65*

___

## Methods

<a id="batchevent"></a>

###  batchEvent

▸ **batchEvent**(e: *`any`*): `void`

*Defined in api.ts:69*

**Parameters:**

| Param | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="batchoff"></a>

###  batchOff

▸ **batchOff**(): `void`

*Defined in api.ts:103*

**Returns:** `void`

___
<a id="batchon"></a>

###  batchOn

▸ **batchOn**(): `void`

*Defined in api.ts:81*

**Returns:** `void`

___
<a id="override"></a>

###  override

▸ **override**(eventDispatcher?: *[EventDispatcher](../modules/_api_.md#eventdispatcher)*, errorDispatcher?: *[ErrorDispatcher](../modules/_api_.md#errordispatcher)*): `void`

*Defined in api.ts:111*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` eventDispatcher | [EventDispatcher](../modules/_api_.md#eventdispatcher) |  this._dispatchEvent |
| `Default value` errorDispatcher | [ErrorDispatcher](../modules/_api_.md#errordispatcher) |  this._dispatchError |

**Returns:** `void`

___
<a id="reset"></a>

###  reset

▸ **reset**(): `void`

*Defined in api.ts:119*

**Returns:** `void`

___
<a id="submiterror"></a>

###  submitError

▸ **submitError**(error: *`object`*, context?: *`object`*): `Promise`<`Response`>

*Defined in api.ts:77*

**Parameters:**

| Param | Type |
| ------ | ------ |
| error | `object` |
| `Optional` context | `object` |

**Returns:** `Promise`<`Response`>

___
<a id="submitevent"></a>

###  submitEvent

▸ **submitEvent**(event: *[Event](_event_.asaevent.event.md)*): `Promise`<`Response`>

*Defined in api.ts:73*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | [Event](_event_.asaevent.event.md) |

**Returns:** `Promise`<`Response`>

___

