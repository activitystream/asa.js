[@activitystream/asa](../README.md) > ["event"](../modules/_event_.md) > [AsaEvent](../modules/_event_.asaevent.md) > [as](../modules/_event_.asaevent.as.md) > [web](../modules/_event_.asaevent.as.web.md) > [product](../modules/_event_.asaevent.as.web.product.md) > [searched](../classes/_event_.asaevent.as.web.product.searched.md)

# Class: searched

## Hierarchy

↳  [product](_event_.asaevent.as.web.product.product.md)

**↳ searched**

## Indexable

\[data: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_event_.asaevent.as.web.product.searched.md#constructor)

### Properties

* [type](_event_.asaevent.as.web.product.searched.md#type)
* [campaign](_event_.asaevent.as.web.product.searched.md#campaign)
* [meta](_event_.asaevent.as.web.product.searched.md#meta)
* [occurred](_event_.asaevent.as.web.product.searched.md#occurred)
* [origin](_event_.asaevent.as.web.product.searched.md#origin)
* [page](_event_.asaevent.as.web.product.searched.md#page)
* [partner_id](_event_.asaevent.as.web.product.searched.md#partner_id)
* [partner_sid](_event_.asaevent.as.web.product.searched.md#partner_sid)
* [tenant](_event_.asaevent.as.web.product.searched.md#tenant)
* [type](_event_.asaevent.as.web.product.searched.md#type-1)
* [user](_event_.asaevent.as.web.product.searched.md#user)
* [v](_event_.asaevent.as.web.product.searched.md#v)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new searched**(data: *`any`*): [searched](_event_.asaevent.as.web.product.searched.md)

*Inherited from [product](_event_.asaevent.as.web.product.product.md).[constructor](_event_.asaevent.as.web.product.product.md#constructor)*

*Defined in [event.ts:87](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L87)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `any` |

**Returns:** [searched](_event_.asaevent.as.web.product.searched.md)

___

## Properties

<a id="type"></a>

###  type

**● type**: *`string`* = "as.web.product.searched"

*Defined in [event.ts:107](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L107)*

___
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
<a id="type-1"></a>

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

