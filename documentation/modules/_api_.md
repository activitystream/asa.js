[@activitystream/asa](../README.md) > ["api"](../modules/_api_.md)

# External module: "api"

## Index

### Classes

* [API](../classes/_api_.api.md)
* [DateTime](../classes/_api_.datetime.md)

### Type aliases

* [AsaError](_api_.md#asaerror)
* [ErrorDispatcher](_api_.md#errordispatcher)
* [ErrorRequest](_api_.md#errorrequest)
* [EventDispatcher](_api_.md#eventdispatcher)
* [EventRequest](_api_.md#eventrequest)

### Functions

* [ERROR](_api_.md#error)
* [EVENT](_api_.md#event)
* [POST](_api_.md#post)
* [submitError](_api_.md#submiterror)
* [submitEvent](_api_.md#submitevent)
* [toDigits](_api_.md#todigits)

---

## Type aliases

<a id="asaerror"></a>

###  AsaError

**ΤAsaError**: *`object`*

*Defined in api.ts:33*

#### Type declaration

 code: `number`

___
<a id="errordispatcher"></a>

###  ErrorDispatcher

**ΤErrorDispatcher**: *`function`*

*Defined in api.ts:48*

#### Type declaration
▸(error: *[AsaError](_api_.md#asaerror)*, context?: *`object`*): `Promise`<`Response`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| error | [AsaError](_api_.md#asaerror) |
| `Optional` context | `object` |

**Returns:** `Promise`<`Response`>

___
<a id="errorrequest"></a>

###  ErrorRequest

**ΤErrorRequest**: *`object`*

*Defined in api.ts:36*

#### Type declaration

`Optional`  context: `object`

[key: `string`]: `any`

 err: [AsaError](_api_.md#asaerror)

 v: `string`

___
<a id="eventdispatcher"></a>

###  EventDispatcher

**ΤEventDispatcher**: *`function`*

*Defined in api.ts:47*

#### Type declaration
▸(event: *[Event](../classes/_event_.asaevent.event.md)*): `Promise`<`Response`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | [Event](../classes/_event_.asaevent.event.md) |

**Returns:** `Promise`<`Response`>

___
<a id="eventrequest"></a>

###  EventRequest

**ΤEventRequest**: *`object`*

*Defined in api.ts:35*

#### Type declaration

 ev: `object`

[key: `string`]: `any`

 t: [DateTime](../classes/_api_.datetime.md)

___

## Functions

<a id="error"></a>

### `<Const>` ERROR

▸ **ERROR**(data: *`object`*): `Promise`<`Response`>

*Defined in api.ts:44*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `object` |

**Returns:** `Promise`<`Response`>

___
<a id="event"></a>

### `<Const>` EVENT

▸ **EVENT**(data: *[EventRequest](_api_.md#eventrequest)*): `Promise`<`Response`>

*Defined in api.ts:42*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | [EventRequest](_api_.md#eventrequest) |

**Returns:** `Promise`<`Response`>

___
<a id="post"></a>

### `<Const>` POST

▸ **POST**(url: *`string`*, data: *`object`*): `Promise`<`Response`>

*Defined in api.ts:24*

**Parameters:**

| Param | Type |
| ------ | ------ |
| url | `string` |
| data | `object` |

**Returns:** `Promise`<`Response`>

___
<a id="submiterror"></a>

### `<Const>` submitError

▸ **submitError**(err: *`object`*, context?: *`object`*): `Promise`<`Response`>

*Defined in api.ts:59*

**Parameters:**

| Param | Type |
| ------ | ------ |
| err | `object` |
| `Optional` context | `object` |

**Returns:** `Promise`<`Response`>

___
<a id="submitevent"></a>

### `<Const>` submitEvent

▸ **submitEvent**(ev: *[Event](../classes/_event_.asaevent.event.md)*): `Promise`<`Response`>

*Defined in api.ts:53*

**Parameters:**

| Param | Type |
| ------ | ------ |
| ev | [Event](../classes/_event_.asaevent.event.md) |

**Returns:** `Promise`<`Response`>

___
<a id="todigits"></a>

### `<Const>` toDigits

▸ **toDigits**(d: *`number`*, n: *`number`*): `string`

*Defined in api.ts:5*

**Parameters:**

| Param | Type |
| ------ | ------ |
| d | `number` |
| n | `number` |

**Returns:** `string`

___

