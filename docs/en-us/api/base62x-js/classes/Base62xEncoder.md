[Documents for @litert/base62x](../../index.md) / [base62x-js](../index.md) / Base62xEncoder

# Class: Base62xEncoder

Defined in: [base62x-js.ts:32](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L32)

The encoder (and also the decoder) for base62x encoding,
written in native JavaScript (TypeScript).

There is also a WebAssembly version of this encoder,
just use `WasmBase62xEncoder` instead of this class
if you want to use it.

## Constructors

### Constructor

> **new Base62xEncoder**(`tag`): `Base62xEncoder`

Defined in: [base62x-js.ts:40](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L40)

#### Parameters

##### tag

`string` = `DEFAULT_X_TAG`

#### Returns

`Base62xEncoder`

## Methods

### bufferFromBase62x()

> **bufferFromBase62x**(`input`): `Buffer`

Defined in: [base62x-js.ts:106](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L106)

Decode a base62x encoded string into a buffer.

#### Parameters

##### input

`string`

The string to be decoded, which should be encoded in base62x.

#### Returns

`Buffer`

The decoded buffer.

#### Throws

If the input string is not a valid base62x encoded string.

***

### bufferToBase62x()

> **bufferToBase62x**(`data`): `string`

Defined in: [base62x-js.ts:63](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L63)

Encode a buffer to a string encoded in base62x.

#### Parameters

##### data

`Buffer`

#### Returns

`string`

***

### stringFromBase62x()

> **stringFromBase62x**(`data`): `string`

Defined in: [base62x-js.ts:208](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L208)

Convert a base62x encoded string back to a UTF-8 string.

#### Parameters

##### data

`string`

The base62x encoded string to be converted.

#### Returns

`string`

The UTF-8 string converted from the base62x encoded string.

***

### stringToBase62x()

> **stringToBase62x**(`data`): `string`

Defined in: [base62x-js.ts:196](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L196)

Convert the bytes of a UTF-8 string to a string encoded in base62x.

#### Parameters

##### data

`string`

The UTF-8 string to be converted to a base62x encoded string.

#### Returns

`string`

The base62x encoded string.
