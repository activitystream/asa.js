[@activitystream/asa](../README.md) > ["event"](../modules/_event_.md) > [AsaEvent](../modules/_event_.asaevent.md) > [as](../modules/_event_.asaevent.as.md) > [web](../modules/_event_.asaevent.as.web.md) > [product](../modules/_event_.asaevent.as.web.product.md) > [product](../classes/_event_.asaevent.as.web.product.product.md)

# Class: product

## Hierarchy

 [Event](_event_.asaevent.event.md)

**↳ product**

↳  [carted](_event_.asaevent.as.web.product.carted.md)

↳  [searched](_event_.asaevent.as.web.product.searched.md)

↳  [viewed](_event_.asaevent.as.web.product.viewed.md)

↳  [checked](_event_.asaevent.as.web.product.availability.checked.md)

↳  [selected](_event_.asaevent.as.web.product.shipping.selected.md)

## Indexable

\[data: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_event_.asaevent.as.web.product.product.md#constructor)

### Properties

* [campaign](_event_.asaevent.as.web.product.product.md#campaign)
* [meta](_event_.asaevent.as.web.product.product.md#meta)
* [occurred](_event_.asaevent.as.web.product.product.md#occurred)
* [origin](_event_.asaevent.as.web.product.product.md#origin)
* [page](_event_.asaevent.as.web.product.product.md#page)
* [partner_id](_event_.asaevent.as.web.product.product.md#partner_id)
* [partner_sid](_event_.asaevent.as.web.product.product.md#partner_sid)
* [tenant](_event_.asaevent.as.web.product.product.md#tenant)
* [type](_event_.asaevent.as.web.product.product.md#type)
* [user](_event_.asaevent.as.web.product.product.md#user)
* [v](_event_.asaevent.as.web.product.product.md#v)

### Methods

* [__@toPrimitive](_event_.asaevent.as.web.product.product.md#___toprimitive)
* [toJSON](_event_.asaevent.as.web.product.product.md#tojson)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new product**(data: *`any`*): [product](_event_.asaevent.as.web.product.product.md)

*Overrides [Event](_event_.asaevent.event.md).[constructor](_event_.asaevent.event.md#constructor)*

*Defined in [event.ts:87](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L87)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `any` |

**Returns:** [product](_event_.asaevent.as.web.product.product.md)

___

## Properties

<a id="campaign"></a>

### `<Static>``<Optional>` campaign

**● campaign**: *[Campaign](_campaign_.campaign.md)*

*Inherited from [Event](_event_.asaevent.event.md).[campaign](_event_.asaevent.event.md#campaign)*

*Defined in [event.ts:24](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L24)*

___
<a id="meta"></a>

### `<Static>` meta

**● meta**: *`any`*

*Inherited from [Event](_event_.asaevent.event.md).[meta](_event_.asaevent.event.md#meta)*

*Defined in [event.ts:36](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L36)*

___
<a id="occurred"></a>

### `<Static>` occurred

**● occurred**: *`Date`*

*Inherited from [Event](_event_.asaevent.event.md).[occurred](_event_.asaevent.event.md#occurred)*

*Defined in [event.ts:23](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L23)*

___
<a id="origin"></a>

### `<Static>` origin

**● origin**: *`string`*

*Inherited from [Event](_event_.asaevent.event.md).[origin](_event_.asaevent.event.md#origin)*

*Defined in [event.ts:22](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L22)*

___
<a id="page"></a>

### `<Static>` page

**● page**: *`object`*

*Inherited from [Event](_event_.asaevent.event.md).[page](_event_.asaevent.event.md#page)*

*Defined in [event.ts:30](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L30)*

#### Type declaration

`Optional`  referrer: `string`

`Optional`  url: `string`

___
<a id="partner_id"></a>

### `<Static>` partner_id

**● partner_id**: *`string`*

*Inherited from [Event](_event_.asaevent.event.md).[partner_id](_event_.asaevent.event.md#partner_id)*

*Defined in [event.ts:34](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L34)*

___
<a id="partner_sid"></a>

### `<Static>` partner_sid

**● partner_sid**: *`string`*

*Inherited from [Event](_event_.asaevent.event.md).[partner_sid](_event_.asaevent.event.md#partner_sid)*

*Defined in [event.ts:35](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L35)*

___
<a id="tenant"></a>

### `<Static>``<Optional>` tenant

**● tenant**: *`string`*

*Inherited from [Event](_event_.asaevent.event.md).[tenant](_event_.asaevent.event.md#tenant)*

*Defined in [event.ts:25](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L25)*

___
<a id="type"></a>

### `<Static>` type

**● type**: *[Type](../modules/_event_.asaevent.md#type)*

*Inherited from [Event](_event_.asaevent.event.md).[type](_event_.asaevent.event.md#type)*

*Defined in [event.ts:21](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L21)*

___
<a id="user"></a>

### `<Static>` user

**● user**: *`object`*

*Inherited from [Event](_event_.asaevent.event.md).[user](_event_.asaevent.event.md#user)*

*Defined in [event.ts:26](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L26)*

#### Type declaration

 did: `string`

 sid: `string`

___
<a id="v"></a>

### `<Static>` v

**● v**: *`string`*

*Inherited from [Event](_event_.asaevent.event.md).[v](_event_.asaevent.event.md#v)*

*Defined in [event.ts:37](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L37)*

___

## Methods

<a id="___toprimitive"></a>

###  __@toPrimitive

▸ **__@toPrimitive**(): `string`

*Inherited from [Event](_event_.asaevent.event.md).[__@toPrimitive](_event_.asaevent.event.md#___toprimitive)*

*Defined in [event.ts:70](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L70)*

**Returns:** `string`

___
<a id="tojson"></a>

###  toJSON

▸ **toJSON**(): `string`

*Inherited from [Event](_event_.asaevent.event.md).[toJSON](_event_.asaevent.event.md#tojson)*

*Defined in [event.ts:66](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L66)*

**Returns:** `string`

___

