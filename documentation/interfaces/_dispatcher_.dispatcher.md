[@activitystream/asa](../README.md) > ["dispatcher"](../modules/_dispatcher_.md) > [Dispatcher](../interfaces/_dispatcher_.dispatcher.md)

# Interface: Dispatcher

## Hierarchy

**Dispatcher**

## Callable
▸ **__call**(name: *[Type](../modules/_event_.asaevent.md#type)*, ...data: *`any`[]*): [Dispatcher](_dispatcher_.dispatcher.md)

*Defined in dispatcher.ts:10*

**Parameters:**

| Param | Type |
| ------ | ------ |
| name | [Type](../modules/_event_.asaevent.md#type) |
| `Rest` data | `any`[] |

**Returns:** [Dispatcher](_dispatcher_.dispatcher.md)

## Index

### Properties

* [id](_dispatcher_.dispatcher.md#id)
* [providers](_dispatcher_.dispatcher.md#providers)

### Methods

* [setProviders](_dispatcher_.dispatcher.md#setproviders)
* [setTenant](_dispatcher_.dispatcher.md#settenant)

---

## Properties

<a id="id"></a>

### `<Optional>` id

**● id**: *`string`*

*Defined in dispatcher.ts:13*

___
<a id="providers"></a>

### `<Optional>` providers

**● providers**: *`string`[]*

*Defined in dispatcher.ts:15*

___

## Methods

<a id="setproviders"></a>

###  setProviders

▸ **setProviders**(providers: *`string`[]*): `void`

*Defined in dispatcher.ts:16*

**Parameters:**

| Param | Type |
| ------ | ------ |
| providers | `string`[] |

**Returns:** `void`

___
<a id="settenant"></a>

###  setTenant

▸ **setTenant**(tenant: *`string`*): `any`

*Defined in dispatcher.ts:14*

**Parameters:**

| Param | Type |
| ------ | ------ |
| tenant | `string` |

**Returns:** `any`

___

