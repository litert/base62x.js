[Documents for @litert/base62x](../../index.md) / [base62x-js](../index.md) / bufferFromBase62x

# Variable: bufferFromBase62x()

> `const` **bufferFromBase62x**: (`input`) => `Buffer`

Defined in: [base62x-js.ts:266](https://github.com/litert/base62x.js/blob/master/src/lib/base62x-js.ts#L266)

Decode a BASE62x-encoded string into a `Buffer`.

Decode a base62x encoded string into a buffer.

## Parameters

### input

`string`

The string to be decoded, which should be encoded in base62x.

## Returns

`Buffer`

The decoded buffer.

## Throws

If the input string is not a valid base62x encoded string.

## Param

The BASE62x-encoded string to be decoded.

## Returns

The decoded `Buffer`.

## Throws

`RangeError` if the input is not a valid BASE62x-encoded string.

## See

https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
