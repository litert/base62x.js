# Quick Start

## Installation

```sh
npm i @litert/base62x --save
```

## Usage

### WebAssembly Edition

The default export is the WebAssembly implementation, which is faster than the JavaScript implementation.

```ts
import * as Base62x from "@litert/base62x";

const b62x = Base62x.stringToBase62x('Hello, 世界!');

console.log('Base62x Encoded:', b62x);

const decoded = Base62x.stringFromBase62x(b62x);

console.log('Base62x Decoded:', decoded);
```

### JavaScript Edition

If you want to use the JavaScript implementation, you can import it directly:

```ts
import * as Base62x from "@litert/base62x/lib/base62x-js";

const b62x = Base62x.stringToBase62x('Hello, 世界!');
console.log('Base62x Encoded:', b62x);

const decoded = Base62x.stringFromBase62x(b62x);
console.log('Base62x Decoded:', decoded);
```