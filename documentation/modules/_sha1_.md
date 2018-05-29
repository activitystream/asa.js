[@activitystream/asa](../README.md) > ["sha1"](../modules/_sha1_.md)

# External module: "sha1"

## Index

### Variables

* [b64pad](_sha1_.md#b64pad)
* [hexcase](_sha1_.md#hexcase)

### Functions

* [any_hmac_sha1](_sha1_.md#any_hmac_sha1)
* [any_sha1](_sha1_.md#any_sha1)
* [b64_hmac_sha1](_sha1_.md#b64_hmac_sha1)
* [b64_sha1](_sha1_.md#b64_sha1)
* [binb2rstr](_sha1_.md#binb2rstr)
* [binb_sha1](_sha1_.md#binb_sha1)
* [bit_rol](_sha1_.md#bit_rol)
* [hex_hmac_sha1](_sha1_.md#hex_hmac_sha1)
* [hex_sha1](_sha1_.md#hex_sha1)
* [rstr2any](_sha1_.md#rstr2any)
* [rstr2b64](_sha1_.md#rstr2b64)
* [rstr2binb](_sha1_.md#rstr2binb)
* [rstr2hex](_sha1_.md#rstr2hex)
* [rstr_hmac_sha1](_sha1_.md#rstr_hmac_sha1)
* [rstr_sha1](_sha1_.md#rstr_sha1)
* [safe_add](_sha1_.md#safe_add)
* [sha1_ft](_sha1_.md#sha1_ft)
* [sha1_kt](_sha1_.md#sha1_kt)
* [sha1_vm_test](_sha1_.md#sha1_vm_test)
* [str2rstr_utf16be](_sha1_.md#str2rstr_utf16be)
* [str2rstr_utf16le](_sha1_.md#str2rstr_utf16le)
* [str2rstr_utf8](_sha1_.md#str2rstr_utf8)
* [uid](_sha1_.md#uid)

---

## Variables

<a id="b64pad"></a>

### `<Let>` b64pad

**● b64pad**: *`string`* = ""

*Defined in [sha1.ts:17](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L17)*

___
<a id="hexcase"></a>

### `<Let>` hexcase

**● hexcase**: *`number`* = 0

*Defined in [sha1.ts:16](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L16)*

___

## Functions

<a id="any_hmac_sha1"></a>

###  any_hmac_sha1

▸ **any_hmac_sha1**(k: *`any`*, d: *`any`*, e: *`any`*): `string`

*Defined in [sha1.ts:39](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L39)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| k | `any` |
| d | `any` |
| e | `any` |

**Returns:** `string`

___
<a id="any_sha1"></a>

###  any_sha1

▸ **any_sha1**(s: *`any`*, e: *`any`*): `string`

*Defined in [sha1.ts:30](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L30)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| s | `any` |
| e | `any` |

**Returns:** `string`

___
<a id="b64_hmac_sha1"></a>

###  b64_hmac_sha1

▸ **b64_hmac_sha1**(k: *`any`*, d: *`any`*): `string`

*Defined in [sha1.ts:36](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L36)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| k | `any` |
| d | `any` |

**Returns:** `string`

___
<a id="b64_sha1"></a>

###  b64_sha1

▸ **b64_sha1**(s: *`any`*): `string`

*Defined in [sha1.ts:27](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L27)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| s | `any` |

**Returns:** `string`

___
<a id="binb2rstr"></a>

###  binb2rstr

▸ **binb2rstr**(input: *`any`*): `string`

*Defined in [sha1.ts:253](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L253)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="binb_sha1"></a>

###  binb_sha1

▸ **binb_sha1**(x: *`any`*, len: *`any`*): `number`[]

*Defined in [sha1.ts:263](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L263)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| x | `any` |
| len | `any` |

**Returns:** `number`[]

___
<a id="bit_rol"></a>

###  bit_rol

▸ **bit_rol**(num: *`any`*, cnt: *`any`*): `number`

*Defined in [sha1.ts:342](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L342)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| num | `any` |
| cnt | `any` |

**Returns:** `number`

___
<a id="hex_hmac_sha1"></a>

###  hex_hmac_sha1

▸ **hex_hmac_sha1**(k: *`any`*, d: *`any`*): `string`

*Defined in [sha1.ts:33](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L33)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| k | `any` |
| d | `any` |

**Returns:** `string`

___
<a id="hex_sha1"></a>

###  hex_sha1

▸ **hex_sha1**(s: *`any`*): `string`

*Defined in [sha1.ts:24](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L24)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| s | `any` |

**Returns:** `string`

___
<a id="rstr2any"></a>

###  rstr2any

▸ **rstr2any**(input: *`any`*, encoding: *`any`*): `string`

*Defined in [sha1.ts:125](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L125)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |
| encoding | `any` |

**Returns:** `string`

___
<a id="rstr2b64"></a>

###  rstr2b64

▸ **rstr2b64**(input: *`any`*): `string`

*Defined in [sha1.ts:99](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L99)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="rstr2binb"></a>

###  rstr2binb

▸ **rstr2binb**(input: *`any`*): `any`[]

*Defined in [sha1.ts:242](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L242)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `any`[]

___
<a id="rstr2hex"></a>

###  rstr2hex

▸ **rstr2hex**(input: *`any`*): `string`

*Defined in [sha1.ts:80](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L80)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="rstr_hmac_sha1"></a>

###  rstr_hmac_sha1

▸ **rstr_hmac_sha1**(key: *`any`*, data: *`any`*): `string`

*Defined in [sha1.ts:62](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L62)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `any` |
| data | `any` |

**Returns:** `string`

___
<a id="rstr_sha1"></a>

###  rstr_sha1

▸ **rstr_sha1**(s: *`any`*): `string`

*Defined in [sha1.ts:55](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L55)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| s | `any` |

**Returns:** `string`

___
<a id="safe_add"></a>

###  safe_add

▸ **safe_add**(x: *`any`*, y: *`any`*): `number`

*Defined in [sha1.ts:333](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L333)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| x | `any` |
| y | `any` |

**Returns:** `number`

___
<a id="sha1_ft"></a>

###  sha1_ft

▸ **sha1_ft**(t: *`any`*, b: *`any`*, c: *`any`*, d: *`any`*): `number`

*Defined in [sha1.ts:309](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L309)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| t | `any` |
| b | `any` |
| c | `any` |
| d | `any` |

**Returns:** `number`

___
<a id="sha1_kt"></a>

###  sha1_kt

▸ **sha1_kt**(t: *`any`*):  `1518500249` &#124; `1859775393` &#124; `-1894007588` &#124; `-899497514`

*Defined in [sha1.ts:319](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L319)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| t | `any` |

**Returns:**  `1518500249` &#124; `1859775393` &#124; `-1894007588` &#124; `-899497514`

___
<a id="sha1_vm_test"></a>

###  sha1_vm_test

▸ **sha1_vm_test**(): `boolean`

*Defined in [sha1.ts:46](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L46)*

**Returns:** `boolean`

___
<a id="str2rstr_utf16be"></a>

###  str2rstr_utf16be

▸ **str2rstr_utf16be**(input: *`any`*): `string`

*Defined in [sha1.ts:228](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L228)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="str2rstr_utf16le"></a>

###  str2rstr_utf16le

▸ **str2rstr_utf16le**(input: *`any`*): `string`

*Defined in [sha1.ts:218](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L218)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="str2rstr_utf8"></a>

###  str2rstr_utf8

▸ **str2rstr_utf8**(input: *`any`*): `string`

*Defined in [sha1.ts:176](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L176)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| input | `any` |

**Returns:** `string`

___
<a id="uid"></a>

### `<Const>` uid

▸ **uid**(): `number`

*Defined in [sha1.ts:10](https://github.com/activitystream/asa.js/blob/7fc5aa0/src/sha1.ts#L10)*

**Returns:** `number`

___

