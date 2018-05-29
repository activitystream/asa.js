[@activitystream/asa](../README.md) > ["event"](../modules/_event_.md) > [AsaEvent](../modules/_event_.asaevent.md) > [Event](../classes/_event_.asaevent.event.md)

# Class: Event

## Hierarchy

**Event**

↳  [reviewed](_event_.asaevent.as.web.order.reviewed.md)

↳  [provided](_event_.asaevent.as.web.customer.account.provided.md)

↳  [product](_event_.asaevent.as.web.product.product.md)

↳  [completed](_event_.asaevent.as.web.payment.completed.md)

## Indexable

\[data: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_event_.asaevent.event.md#constructor)

### Properties

* [campaign](_event_.asaevent.event.md#campaign)
* [meta](_event_.asaevent.event.md#meta)
* [occurred](_event_.asaevent.event.md#occurred)
* [origin](_event_.asaevent.event.md#origin)
* [page](_event_.asaevent.event.md#page)
* [partner_id](_event_.asaevent.event.md#partner_id)
* [partner_sid](_event_.asaevent.event.md#partner_sid)
* [tenant](_event_.asaevent.event.md#tenant)
* [type](_event_.asaevent.event.md#type)
* [user](_event_.asaevent.event.md#user)
* [v](_event_.asaevent.event.md#v)

### Methods

* [__@toPrimitive](_event_.asaevent.event.md#___toprimitive)
* [toJSON](_event_.asaevent.event.md#tojson)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Event**(): [Event](_event_.asaevent.event.md)

*Defined in [event.ts:41](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L41)*

**Returns:** [Event](_event_.asaevent.event.md)

___

## Properties

<a id="campaign"></a>

### `<Optional>` campaign

**● campaign**: *[Campaign](_campaign_.campaign.md)*

*Defined in [event.ts:24](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L24)*

___
<a id="meta"></a>

###  meta

**● meta**: *`any`*

*Defined in [event.ts:36](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L36)*

___
<a id="occurred"></a>

###  occurred

**● occurred**: *`Date`*

*Defined in [event.ts:23](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L23)*

___
<a id="origin"></a>

###  origin

**● origin**: *`string`*

*Defined in [event.ts:22](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L22)*

___
<a id="page"></a>

###  page

**● page**: *`object`*

*Defined in [event.ts:30](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L30)*

#### Type declaration

`Optional`  referrer: `string`

`Optional`  url: `string`

___
<a id="partner_id"></a>

###  partner_id

**● partner_id**: *`string`*

*Defined in [event.ts:34](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L34)*

___
<a id="partner_sid"></a>

###  partner_sid

**● partner_sid**: *`string`*

*Defined in [event.ts:35](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L35)*

___
<a id="tenant"></a>

### `<Optional>` tenant

**● tenant**: *`string`*

*Defined in [event.ts:25](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L25)*

___
<a id="type"></a>

###  type

**● type**: *[Type](../modules/_event_.asaevent.md#type)*

*Defined in [event.ts:21](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L21)*

___
<a id="user"></a>

###  user

**● user**: *`object`*

*Defined in [event.ts:26](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L26)*

#### Type declaration

 did: `string`

 sid: `string`

___
<a id="v"></a>

###  v

**● v**: *`string`*

*Defined in [event.ts:37](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L37)*

___

## Methods

<a id="___toprimitive"></a>

###  __@toPrimitive

▸ **__@toPrimitive**(): `string`

*Defined in [event.ts:70](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L70)*

**Returns:** `string`

___
<a id="tojson"></a>

###  toJSON

▸ **toJSON**(): `string`

*Defined in [event.ts:66](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L66)*

**Returns:** `string`

___

