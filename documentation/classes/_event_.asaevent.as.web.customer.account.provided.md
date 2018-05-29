[@activitystream/asa](../README.md) > ["event"](../modules/_event_.md) > [AsaEvent](../modules/_event_.asaevent.md) > [as](../modules/_event_.asaevent.as.md) > [web](../modules/_event_.asaevent.as.web.md) > [customer](../modules/_event_.asaevent.as.web.customer.md) > [account](../modules/_event_.asaevent.as.web.customer.account.md) > [provided](../classes/_event_.asaevent.as.web.customer.account.provided.md)

# Class: provided

## Hierarchy

 [Event](_event_.asaevent.event.md)

**↳ provided**

## Indexable

\[data: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_event_.asaevent.as.web.customer.account.provided.md#constructor)

### Properties

* [type](_event_.asaevent.as.web.customer.account.provided.md#type)
* [campaign](_event_.asaevent.as.web.customer.account.provided.md#campaign)
* [meta](_event_.asaevent.as.web.customer.account.provided.md#meta)
* [occurred](_event_.asaevent.as.web.customer.account.provided.md#occurred)
* [origin](_event_.asaevent.as.web.customer.account.provided.md#origin)
* [page](_event_.asaevent.as.web.customer.account.provided.md#page)
* [partner_id](_event_.asaevent.as.web.customer.account.provided.md#partner_id)
* [partner_sid](_event_.asaevent.as.web.customer.account.provided.md#partner_sid)
* [tenant](_event_.asaevent.as.web.customer.account.provided.md#tenant)
* [type](_event_.asaevent.as.web.customer.account.provided.md#type-1)
* [user](_event_.asaevent.as.web.customer.account.provided.md#user)
* [v](_event_.asaevent.as.web.customer.account.provided.md#v)

### Methods

* [__@toPrimitive](_event_.asaevent.as.web.customer.account.provided.md#___toprimitive)
* [toJSON](_event_.asaevent.as.web.customer.account.provided.md#tojson)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new provided**(): [provided](_event_.asaevent.as.web.customer.account.provided.md)

*Inherited from [Event](_event_.asaevent.event.md).[constructor](_event_.asaevent.event.md#constructor)*

*Defined in [event.ts:41](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L41)*

**Returns:** [provided](_event_.asaevent.as.web.customer.account.provided.md)

___

## Properties

<a id="type"></a>

###  type

**● type**: *`string`* = "as.web.customer.account.provided"

*Defined in [event.ts:83](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/event.ts#L83)*

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

