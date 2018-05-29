[@activitystream/asa](../README.md) > ["session"](../modules/_session_.md)

# External module: "session"

## Index

### Classes

* [SessionManager](../classes/_session_.sessionmanager.md)

### Interfaces

* [Data](../interfaces/_session_.data.md)
* [Session](../interfaces/_session_.session.md)

### Variables

* [SESSION_COOKIE_NAME](_session_.md#session_cookie_name)
* [SESSION_EXPIRE_TIMEOUT](_session_.md#session_expire_timeout)
* [sessionManager](_session_.md#sessionmanager-1)
* [sessionStore](_session_.md#sessionstore)

### Functions

* [customSession](_session_.md#customsession)
* [resetManager](_session_.md#resetmanager)

### Object literals

* [persistence](_session_.md#persistence)
* [proxy](_session_.md#proxy)
* [store](_session_.md#store)

---

## Variables

<a id="session_cookie_name"></a>

### `<Const>` SESSION_COOKIE_NAME

**● SESSION_COOKIE_NAME**: *"__asa_session"* = "__asa_session"

*Defined in [session.ts:47](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L47)*

___
<a id="session_expire_timeout"></a>

### `<Const>` SESSION_EXPIRE_TIMEOUT

**● SESSION_EXPIRE_TIMEOUT**: *`number`* =  30 * 60 * 1000

*Defined in [session.ts:46](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L46)*

___
<a id="sessionmanager-1"></a>

### `<Let>` sessionManager

**● sessionManager**: *[SessionManager](../classes/_session_.sessionmanager.md)* =  new SessionManager()

*Defined in [session.ts:112](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L112)*

___
<a id="sessionstore"></a>

### `<Const>` sessionStore

**● sessionStore**: *`object`* =  store

*Defined in [session.ts:44](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L44)*

#### Type declaration

 getItem: [get](_session_.md#persistence.get)

 hasItem: [get](_session_.md#persistence.get)

 removeItem: [remove]()

 setItem: [set](_session_.md#persistence.set)

___

## Functions

<a id="customsession"></a>

### `<Const>` customSession

▸ **customSession**(hasSession: *`function`*, getSession: *`function`*, createSession: *`function`*): `void`

*Defined in [session.ts:113](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L113)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| hasSession | `function` |
| getSession | `function` |
| createSession | `function` |

**Returns:** `void`

___
<a id="resetmanager"></a>

### `<Const>` resetManager

▸ **resetManager**(): `void`

*Defined in [session.ts:130](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L130)*

**Returns:** `void`

___

## Object literals

<a id="persistence"></a>

### `<Const>` persistence

**persistence**: *`object`*

*Defined in [session.ts:7](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L7)*

<a id="persistence.get"></a>

####  get

▸ **get**(id: *`string`*): `string`

*Defined in [session.ts:8](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L8)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `string`

___
<a id="persistence.remove"></a>

####  remove

▸ **remove**(id: *`string`*): `void`

*Defined in [session.ts:26](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L26)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `void`

___
<a id="persistence.set"></a>

####  set

▸ **set**(id: *`string`*, value: *`string`*): `boolean`

*Defined in [session.ts:17](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L17)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |
| value | `string` |

**Returns:** `boolean`

___

___
<a id="proxy"></a>

### `<Const>` proxy

**proxy**: *`object`*

*Defined in [session.ts:134](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L134)*

<a id="proxy.createsession"></a>

####  createSession

▸ **createSession**(data?: *[Data](../interfaces/_session_.data.md)*): `void`

*Defined in [session.ts:136](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L136)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` data | [Data](../interfaces/_session_.data.md) |

**Returns:** `void`

___
<a id="proxy.destroysession"></a>

####  destroySession

▸ **destroySession**(): `void`

*Defined in [session.ts:139](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L139)*

**Returns:** `void`

___
<a id="proxy.getsession"></a>

####  getSession

▸ **getSession**(): [Session](../interfaces/_session_.session.md)

*Defined in [session.ts:135](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L135)*

**Returns:** [Session](../interfaces/_session_.session.md)

___
<a id="proxy.hassession"></a>

####  hasSession

▸ **hasSession**(): `boolean`

*Defined in [session.ts:137](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L137)*

**Returns:** `boolean`

___
<a id="proxy.updatetimeout"></a>

####  updateTimeout

▸ **updateTimeout**(data?: *[Data](../interfaces/_session_.data.md)*): `void`

*Defined in [session.ts:138](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L138)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` data | [Data](../interfaces/_session_.data.md) |

**Returns:** `void`

___

___
<a id="store"></a>

### `<Const>` store

**store**: *`object`*

*Defined in [session.ts:37](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L37)*

<a id="store.getitem-1"></a>

####  getItem

**● getItem**: *[get](_session_.md#persistence.get)* =  persistence.get

*Defined in [session.ts:39](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L39)*

___
<a id="store.hasitem-1"></a>

####  hasItem

**● hasItem**: *[get](_session_.md#persistence.get)* =  persistence.get

*Defined in [session.ts:38](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L38)*

___
<a id="store.removeitem-1"></a>

####  removeItem

**● removeItem**: *[remove]()* =  persistence.remove

*Defined in [session.ts:41](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L41)*

___
<a id="store.setitem-1"></a>

####  setItem

**● setItem**: *[set](_session_.md#persistence.set)* =  persistence.set

*Defined in [session.ts:40](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/session.ts#L40)*

___

___

