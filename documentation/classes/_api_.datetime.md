[@activitystream/asa](../README.md) > ["api"](../modules/_api_.md) > [DateTime](../classes/_api_.datetime.md)

# Class: DateTime

## Hierarchy

 `Date`

**↳ DateTime**

## Index

### Properties

* [Date](_api_.datetime.md#date)
* [getVarDate](_api_.datetime.md#getvardate)

### Methods

* [toJSON](_api_.datetime.md#tojson)
* [__@toPrimitive](_api_.datetime.md#___toprimitive)
* [getDate](_api_.datetime.md#getdate)
* [getDay](_api_.datetime.md#getday)
* [getFullYear](_api_.datetime.md#getfullyear)
* [getHours](_api_.datetime.md#gethours)
* [getMilliseconds](_api_.datetime.md#getmilliseconds)
* [getMinutes](_api_.datetime.md#getminutes)
* [getMonth](_api_.datetime.md#getmonth)
* [getSeconds](_api_.datetime.md#getseconds)
* [getTime](_api_.datetime.md#gettime)
* [getTimezoneOffset](_api_.datetime.md#gettimezoneoffset)
* [getUTCDate](_api_.datetime.md#getutcdate)
* [getUTCDay](_api_.datetime.md#getutcday)
* [getUTCFullYear](_api_.datetime.md#getutcfullyear)
* [getUTCHours](_api_.datetime.md#getutchours)
* [getUTCMilliseconds](_api_.datetime.md#getutcmilliseconds)
* [getUTCMinutes](_api_.datetime.md#getutcminutes)
* [getUTCMonth](_api_.datetime.md#getutcmonth)
* [getUTCSeconds](_api_.datetime.md#getutcseconds)
* [setDate](_api_.datetime.md#setdate)
* [setFullYear](_api_.datetime.md#setfullyear)
* [setHours](_api_.datetime.md#sethours)
* [setMilliseconds](_api_.datetime.md#setmilliseconds)
* [setMinutes](_api_.datetime.md#setminutes)
* [setMonth](_api_.datetime.md#setmonth)
* [setSeconds](_api_.datetime.md#setseconds)
* [setTime](_api_.datetime.md#settime)
* [setUTCDate](_api_.datetime.md#setutcdate)
* [setUTCFullYear](_api_.datetime.md#setutcfullyear)
* [setUTCHours](_api_.datetime.md#setutchours)
* [setUTCMilliseconds](_api_.datetime.md#setutcmilliseconds)
* [setUTCMinutes](_api_.datetime.md#setutcminutes)
* [setUTCMonth](_api_.datetime.md#setutcmonth)
* [setUTCSeconds](_api_.datetime.md#setutcseconds)
* [toDateString](_api_.datetime.md#todatestring)
* [toISOString](_api_.datetime.md#toisostring)
* [toJSON](_api_.datetime.md#tojson-1)
* [toLocaleDateString](_api_.datetime.md#tolocaledatestring)
* [toLocaleString](_api_.datetime.md#tolocalestring)
* [toLocaleTimeString](_api_.datetime.md#tolocaletimestring)
* [toString](_api_.datetime.md#tostring)
* [toTimeString](_api_.datetime.md#totimestring)
* [toUTCString](_api_.datetime.md#toutcstring)
* [valueOf](_api_.datetime.md#valueof)

---

## Properties

<a id="date"></a>

### `<Static>` Date

**● Date**: *`DateConstructor`*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:819*

___
<a id="getvardate"></a>

### `<Static>` getVarDate

**● getVarDate**: *`function`*

*Inherited from Date.getVarDate*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:21593*

#### Type declaration
▸(): `VarDate`

**Returns:** `VarDate`

___

## Methods

<a id="tojson"></a>

###  toJSON

▸ **toJSON**(): `string`

*Defined in api.ts:9*

**Returns:** `string`

___
<a id="___toprimitive"></a>

### `<Static>` __@toPrimitive

▸ **__@toPrimitive**(hint: *"default"*): `string`

▸ **__@toPrimitive**(hint: *"string"*): `string`

▸ **__@toPrimitive**(hint: *"number"*): `number`

▸ **__@toPrimitive**(hint: *`string`*):  `string` &#124; `number`

*Inherited from Date.[Symbol.toPrimitive]*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:5627*

Converts a Date object to a string.

**Parameters:**

| Param | Type |
| ------ | ------ |
| hint | "default" |

**Returns:** `string`

*Inherited from Date.[Symbol.toPrimitive]*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:5631*

Converts a Date object to a string.

**Parameters:**

| Param | Type |
| ------ | ------ |
| hint | "string" |

**Returns:** `string`

*Inherited from Date.[Symbol.toPrimitive]*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:5635*

Converts a Date object to a number.

**Parameters:**

| Param | Type |
| ------ | ------ |
| hint | "number" |

**Returns:** `number`

*Inherited from Date.[Symbol.toPrimitive]*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:5644*

Converts a Date object to a string or number.
*__throws__*: {TypeError} If 'hint' was given something other than "number", "string", or "default".

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| hint | `string` |  The strings "number", "string", or "default" to specify what primitive to return. |

**Returns:**  `string` &#124; `number`

A number if 'hint' was "number", a string if 'hint' was "string" or "default".

___
<a id="getdate"></a>

### `<Static>` getDate

▸ **getDate**(): `number`

*Inherited from Date.getDate*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:666*

Gets the day-of-the-month, using local time.

**Returns:** `number`

___
<a id="getday"></a>

### `<Static>` getDay

▸ **getDay**(): `number`

*Inherited from Date.getDay*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:670*

Gets the day of the week, using local time.

**Returns:** `number`

___
<a id="getfullyear"></a>

### `<Static>` getFullYear

▸ **getFullYear**(): `number`

*Inherited from Date.getFullYear*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:658*

Gets the year, using local time.

**Returns:** `number`

___
<a id="gethours"></a>

### `<Static>` getHours

▸ **getHours**(): `number`

*Inherited from Date.getHours*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:674*

Gets the hours in a date, using local time.

**Returns:** `number`

___
<a id="getmilliseconds"></a>

### `<Static>` getMilliseconds

▸ **getMilliseconds**(): `number`

*Inherited from Date.getMilliseconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:686*

Gets the milliseconds of a Date, using local time.

**Returns:** `number`

___
<a id="getminutes"></a>

### `<Static>` getMinutes

▸ **getMinutes**(): `number`

*Inherited from Date.getMinutes*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:678*

Gets the minutes of a Date object, using local time.

**Returns:** `number`

___
<a id="getmonth"></a>

### `<Static>` getMonth

▸ **getMonth**(): `number`

*Inherited from Date.getMonth*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:662*

Gets the month, using local time.

**Returns:** `number`

___
<a id="getseconds"></a>

### `<Static>` getSeconds

▸ **getSeconds**(): `number`

*Inherited from Date.getSeconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:682*

Gets the seconds of a Date object, using local time.

**Returns:** `number`

___
<a id="gettime"></a>

### `<Static>` getTime

▸ **getTime**(): `number`

*Inherited from Date.getTime*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:656*

Gets the time value in milliseconds.

**Returns:** `number`

___
<a id="gettimezoneoffset"></a>

### `<Static>` getTimezoneOffset

▸ **getTimezoneOffset**(): `number`

*Inherited from Date.getTimezoneOffset*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:690*

Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcdate"></a>

### `<Static>` getUTCDate

▸ **getUTCDate**(): `number`

*Inherited from Date.getUTCDate*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:668*

Gets the day-of-the-month, using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcday"></a>

### `<Static>` getUTCDay

▸ **getUTCDay**(): `number`

*Inherited from Date.getUTCDay*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:672*

Gets the day of the week using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcfullyear"></a>

### `<Static>` getUTCFullYear

▸ **getUTCFullYear**(): `number`

*Inherited from Date.getUTCFullYear*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:660*

Gets the year using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutchours"></a>

### `<Static>` getUTCHours

▸ **getUTCHours**(): `number`

*Inherited from Date.getUTCHours*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:676*

Gets the hours value in a Date object using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcmilliseconds"></a>

### `<Static>` getUTCMilliseconds

▸ **getUTCMilliseconds**(): `number`

*Inherited from Date.getUTCMilliseconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:688*

Gets the milliseconds of a Date object using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcminutes"></a>

### `<Static>` getUTCMinutes

▸ **getUTCMinutes**(): `number`

*Inherited from Date.getUTCMinutes*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:680*

Gets the minutes of a Date object using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcmonth"></a>

### `<Static>` getUTCMonth

▸ **getUTCMonth**(): `number`

*Inherited from Date.getUTCMonth*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:664*

Gets the month of a Date object using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="getutcseconds"></a>

### `<Static>` getUTCSeconds

▸ **getUTCSeconds**(): `number`

*Inherited from Date.getUTCSeconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:684*

Gets the seconds of a Date object using Universal Coordinated Time (UTC).

**Returns:** `number`

___
<a id="setdate"></a>

### `<Static>` setDate

▸ **setDate**(date: *`number`*): `number`

*Inherited from Date.setDate*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:753*

Sets the numeric day-of-the-month value of the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| date | `number` |  A numeric value equal to the day of the month. |

**Returns:** `number`

___
<a id="setfullyear"></a>

### `<Static>` setFullYear

▸ **setFullYear**(year: *`number`*, month?: *`number`*, date?: *`number`*): `number`

*Inherited from Date.setFullYear*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:777*

Sets the year of the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| year | `number` |  A numeric value for the year. |
| `Optional` month | `number` |  A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified. |
| `Optional` date | `number` |  A numeric value equal for the day of the month. |

**Returns:** `number`

___
<a id="sethours"></a>

### `<Static>` setHours

▸ **setHours**(hours: *`number`*, min?: *`number`*, sec?: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setHours*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:740*

Sets the hour value in the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| hours | `number` |  A numeric value equal to the hours value. |
| `Optional` min | `number` |  A numeric value equal to the minutes value. |
| `Optional` sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="setmilliseconds"></a>

### `<Static>` setMilliseconds

▸ **setMilliseconds**(ms: *`number`*): `number`

*Inherited from Date.setMilliseconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:700*

Sets the milliseconds value in the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ms | `number` |  A numeric value equal to the millisecond value. |

**Returns:** `number`

___
<a id="setminutes"></a>

### `<Static>` setMinutes

▸ **setMinutes**(min: *`number`*, sec?: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setMinutes*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:725*

Sets the minutes value in the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| min | `number` |  A numeric value equal to the minutes value. |
| `Optional` sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="setmonth"></a>

### `<Static>` setMonth

▸ **setMonth**(month: *`number`*, date?: *`number`*): `number`

*Inherited from Date.setMonth*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:764*

Sets the month value in the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| month | `number` |  A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. |
| `Optional` date | `number` |  A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used. |

**Returns:** `number`

___
<a id="setseconds"></a>

### `<Static>` setSeconds

▸ **setSeconds**(sec: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setSeconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:712*

Sets the seconds value in the Date object using local time.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="settime"></a>

### `<Static>` setTime

▸ **setTime**(time: *`number`*): `number`

*Inherited from Date.setTime*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:695*

Sets the date and time value in the Date object.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| time | `number` |  A numeric value representing the number of elapsed milliseconds since midnight, January 1, 1970 GMT. |

**Returns:** `number`

___
<a id="setutcdate"></a>

### `<Static>` setUTCDate

▸ **setUTCDate**(date: *`number`*): `number`

*Inherited from Date.setUTCDate*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:758*

Sets the numeric day of the month in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| date | `number` |  A numeric value equal to the day of the month. |

**Returns:** `number`

___
<a id="setutcfullyear"></a>

### `<Static>` setUTCFullYear

▸ **setUTCFullYear**(year: *`number`*, month?: *`number`*, date?: *`number`*): `number`

*Inherited from Date.setUTCFullYear*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:784*

Sets the year value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| year | `number` |  A numeric value equal to the year. |
| `Optional` month | `number` |  A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. Must be supplied if numDate is supplied. |
| `Optional` date | `number` |  A numeric value equal to the day of the month. |

**Returns:** `number`

___
<a id="setutchours"></a>

### `<Static>` setUTCHours

▸ **setUTCHours**(hours: *`number`*, min?: *`number`*, sec?: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setUTCHours*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:748*

Sets the hours value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| hours | `number` |  A numeric value equal to the hours value. |
| `Optional` min | `number` |  A numeric value equal to the minutes value. |
| `Optional` sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="setutcmilliseconds"></a>

### `<Static>` setUTCMilliseconds

▸ **setUTCMilliseconds**(ms: *`number`*): `number`

*Inherited from Date.setUTCMilliseconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:705*

Sets the milliseconds value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ms | `number` |  A numeric value equal to the millisecond value. |

**Returns:** `number`

___
<a id="setutcminutes"></a>

### `<Static>` setUTCMinutes

▸ **setUTCMinutes**(min: *`number`*, sec?: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setUTCMinutes*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:732*

Sets the minutes value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| min | `number` |  A numeric value equal to the minutes value. |
| `Optional` sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="setutcmonth"></a>

### `<Static>` setUTCMonth

▸ **setUTCMonth**(month: *`number`*, date?: *`number`*): `number`

*Inherited from Date.setUTCMonth*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:770*

Sets the month value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| month | `number` |  A numeric value equal to the month. The value for January is 0, and other month values follow consecutively. |
| `Optional` date | `number` |  A numeric value representing the day of the month. If it is not supplied, the value from a call to the getUTCDate method is used. |

**Returns:** `number`

___
<a id="setutcseconds"></a>

### `<Static>` setUTCSeconds

▸ **setUTCSeconds**(sec: *`number`*, ms?: *`number`*): `number`

*Inherited from Date.setUTCSeconds*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:718*

Sets the seconds value in the Date object using Universal Coordinated Time (UTC).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| sec | `number` |  A numeric value equal to the seconds value. |
| `Optional` ms | `number` |  A numeric value equal to the milliseconds value. |

**Returns:** `number`

___
<a id="todatestring"></a>

### `<Static>` toDateString

▸ **toDateString**(): `string`

*Inherited from Date.toDateString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:644*

Returns a date as a string value.

**Returns:** `string`

___
<a id="toisostring"></a>

### `<Static>` toISOString

▸ **toISOString**(): `string`

*Inherited from Date.toISOString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:788*

Returns a date as a string value in ISO format.

**Returns:** `string`

___
<a id="tojson-1"></a>

### `<Static>` toJSON

▸ **toJSON**(key?: *`any`*): `string`

*Inherited from Date.toJSON*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:790*

Used by the JSON.stringify method to enable the transformation of an object's data for JavaScript Object Notation (JSON) serialization.

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` key | `any` |

**Returns:** `string`

___
<a id="tolocaledatestring"></a>

### `<Static>` toLocaleDateString

▸ **toLocaleDateString**(): `string`

*Inherited from Date.toLocaleDateString*

*Overrides Date.toLocaleDateString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:650*

Returns a date as a string value appropriate to the host environment's current locale.

**Returns:** `string`

___
<a id="tolocalestring"></a>

### `<Static>` toLocaleString

▸ **toLocaleString**(): `string`

*Inherited from Date.toLocaleString*

*Overrides Date.toLocaleString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:648*

Returns a value as a string value appropriate to the host environment's current locale.

**Returns:** `string`

___
<a id="tolocaletimestring"></a>

### `<Static>` toLocaleTimeString

▸ **toLocaleTimeString**(): `string`

*Inherited from Date.toLocaleTimeString*

*Overrides Date.toLocaleTimeString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:652*

Returns a time as a string value appropriate to the host environment's current locale.

**Returns:** `string`

___
<a id="tostring"></a>

### `<Static>` toString

▸ **toString**(): `string`

*Inherited from Date.toString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:642*

Returns a string representation of a date. The format of the string depends on the locale.

**Returns:** `string`

___
<a id="totimestring"></a>

### `<Static>` toTimeString

▸ **toTimeString**(): `string`

*Inherited from Date.toTimeString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:646*

Returns a time as a string value.

**Returns:** `string`

___
<a id="toutcstring"></a>

### `<Static>` toUTCString

▸ **toUTCString**(): `string`

*Inherited from Date.toUTCString*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:786*

Returns a date converted to a string using Universal Coordinated Time (UTC).

**Returns:** `string`

___
<a id="valueof"></a>

### `<Static>` valueOf

▸ **valueOf**(): `number`

*Inherited from Date.valueOf*

*Defined in /home/raegen/IdeaProjects/activitystream/@activitystream/asa.js/node_modules/typedoc/node_modules/typescript/lib/lib.es6.d.ts:654*

Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.

**Returns:** `number`

___

