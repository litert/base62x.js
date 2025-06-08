[Documents for @litert/base62x](../../index.md) / [base62x-wasm](../index.md) / WasmBase62xEncoder

# Class: WasmBase62xEncoder

Defined in: [base62x-wasm.ts:41](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L41)

The encoder (and also the decoder) for base62x encoding,
written in WebAssembly.

## Constructors

### Constructor

> **new WasmBase62xEncoder**(`tag`): `WasmBase62xEncoder`

Defined in: [base62x-wasm.ts:57](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L57)

#### Parameters

##### tag

`string` = `DEFAULT_X_TAG`

#### Returns

`WasmBase62xEncoder`

## Methods

### bufferFromBase62x()

> **bufferFromBase62x**(`input`): `Buffer`

Defined in: [base62x-wasm.ts:116](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L116)

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

Defined in: [base62x-wasm.ts:85](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L85)

Encode a buffer to a string encoded in base62x.

#### Parameters

##### data

`Buffer`

#### Returns

`string`

***

### stringFromBase62x()

> **stringFromBase62x**(`data`): `string`

Defined in: [base62x-wasm.ts:169](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L169)

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

Defined in: [base62x-wasm.ts:157](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L157)

Convert the bytes of a UTF-8 string to a string encoded in base62x.

#### Parameters

##### data

`string`

The UTF-8 string to be converted to a base62x encoded string.

#### Returns

`string`

The base62x encoded string.
