import * as Base62x from '../lib';
import * as Base62xJs from "../lib/base62x-js";

(() => {

    const strToB62x = Base62xJs.stringToBase62x('Hello, 世界!');
    console.log('Base62x Encoded:', strToB62x);

    const strDecoded = Base62xJs.stringFromBase62x(strToB62x);
    console.log('Base62x Decoded:', strDecoded);

    const bufToB62x = Base62xJs.bufferToBase62x(Buffer.from('Hello, 世界!'));
    console.log('Base62x Buffer Encoded:', bufToB62x);

    const bufDecoded = Base62xJs.bufferFromBase62x(bufToB62x);
    console.log('Base62x Buffer Decoded:', bufDecoded.toString());
})();

(() => {

    const strToB62x = Base62x.stringToBase62x('Hello, 世界!');

    console.log('Base62x Encoded:', strToB62x);

    const strDecoded = Base62x.stringFromBase62x(strToB62x);

    console.log('Base62x Decoded:', strDecoded);

    const bufToB62x = Base62x.bufferToBase62x(Buffer.from('Hello, 世界!'));
    console.log('Base62x Buffer Encoded:', bufToB62x);

    const bufDecoded = Base62x.bufferFromBase62x(bufToB62x);
    console.log('Base62x Buffer Decoded:', bufDecoded.toString());
})();
