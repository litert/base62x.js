[Documents for @litert/base62x](../../index.md) / [base62x-wasm](../index.md) / stringFromBase62x

# Variable: stringFromBase62x()

> `const` **stringFromBase62x**: (`data`) => `string`

Defined in: [base62x-wasm.ts:201](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-wasm.ts#L201)

Decode a BASE62x-encoded string into a UTF-8 string.

> This method calls `bufferFromBASE62x` to decode the input string into a `Buffer`, and then
> converts it to a UTF-8 string.

Convert a base62x encoded string back to a UTF-8 string.

## Parameters

### data

`string`

The base62x encoded string to be converted.

## Returns

`string`

The UTF-8 string converted from the base62x encoded string.

## Param

The BASE62x-encoded string to be decoded.

## Returns

The decoded UTF-8 string.

## Throws

`RangeError` if the input is not a valid BASE62x-encoded string.

## See

https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
