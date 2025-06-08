# LiteRT/BASE62x

[![npm version](https://img.shields.io/npm/v/@litert/base62x.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/base62x "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/base62x.svg?maxAge=2592000?style=plastic)](https://github.com/litert/base62x/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/litert/base62x.js.svg)](https://github.com/litert/base62x.js/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/base62x.js.svg)](https://github.com/litert/base62x.js/releases "Stable Release")

The encoding and decoding library for [BASE62x](https://ieeexplore.ieee.org/document/6020065?arnumber=6020065), in Node.js.

> WebAssembly implementation included, which could be also used in the browser.

## Installation

```sh
npm i @litert/base62x --save
```

## Quick Start

Use the library in Node.js like this:

> The default export is the WebAssembly implementation.

```ts
import * as Base62x from "@litert/base62x";

const b62x = Base62x.stringToBase62x('Hello, 世界!');

console.log('Base62x Encoded:', b62x);

const decoded = Base62x.stringFromBase62x(b62x);

console.log('Base62x Decoded:', decoded);
```

## Documents

- [en-us](https://litert.org/projects/base62x.js/)

## License

This library is published under [Apache-2.0](./LICENSE) license.
