[Documents for @litert/base62x](../../index.md) / [base62x-wasm](../index.md) / stringToBase62x

# Variable: stringToBase62x()

> `const` **stringToBase62x**: (`data`) => `string`

Defined in: [base62x-wasm.ts:188](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L188)

Encode a UTF-8 string into a BASE62x-encoded string.

> This method transform the input string into a `Buffer`, and then calls `bufferToBASE62x`.

Convert the bytes of a UTF-8 string to a string encoded in base62x.

## Parameters

### data

`string`

The UTF-8 string to be converted to a base62x encoded string.

## Returns

`string`

The base62x encoded string.

## Param

The string to be encoded.

## Returns

The BASE62x-encoded string.

## See

https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
