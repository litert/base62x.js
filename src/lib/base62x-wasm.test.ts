import * as NodeFS from 'node:fs';
import * as NodeCrypto from 'node:crypto';
import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { WasmBase62xEncoder } from './base62x-wasm';

NodeTest.describe('Base62x Encoding [WebAssembly Edition]', () => {

    NodeTest.it('should encode and decode strings correctly', () => {

        const enc = new WasmBase62xEncoder('x');

        const stringTestCases = [
            ['A', 'G1'],
            ['AB', 'GK2'],
            ['ABC', 'GK93'],
            ['ABCD', 'GK93H0'],
            ['ABCDE', 'GK93H45'],
            ['ABCDEF', 'GK93H4L6'],
            ['ABCDEFG', 'GK93H4L6H3'],
            ['ABCDEFGH', 'GK93H4L6Hq8'],
            ['ABCDEFGHI', 'GK93H4L6HqX9'],
            ['你', 'vBsW'],
            ['你好', 'vBsWvQMx1'],
            ['我爱你', 'veYHvuYnvBsW'],
        ];

        for (const [origin, encoded] of stringTestCases) {
            NodeAssert.strictEqual(enc.stringToBase62x(origin), encoded);
            NodeAssert.strictEqual(enc.stringFromBase62x(encoded), origin);
        }
    });

    NodeTest.it('should encode and decode buffers correctly', () => {

        const enc = new WasmBase62xEncoder('x');

        const bufferTestCases = [
            [Buffer.from('A'), 'G1'],
            [Buffer.from('QA', 'base64url'), 'G0'],
            [Buffer.from('ops', 'base64url'), 'efB'],
            [Buffer.from('T4Ee', 'base64url'), 'Ju4U'],
            [Buffer.from('HFqnlA', 'base64url'), '75gdb0'],
            [Buffer.from('bOIPqAY', 'base64url'), 'RE8Fg06'],
            [Buffer.from('i6tbzTn3', 'base64url'), 'YwjRpJdt'],
            [Buffer.from('Is4k4SmfSw', 'base64url'), '8iuauIcVI3'],
            [Buffer.from('32deXpyn_18', 'base64url'), 'tsTUNfodx3rF'],
            [Buffer.from('9-kyb-6cSoM7', 'base64url'), 'x1x2aoRx2wSIeCy'],
            [Buffer.from('56LX-R7PjOfFcA', 'base64url'), 'vwBNx2HyFZEV5S0'],
        ] as const;

        for (const [origin, encoded] of bufferTestCases) {
            NodeAssert.strictEqual(enc.bufferToBase62x(origin), encoded);
            NodeAssert.strictEqual(enc.bufferFromBase62x(encoded).toString(), origin.toString());
        }
    });

    NodeTest.it('should encode and decode test data correctly', () => {

        const enc = new WasmBase62xEncoder('x');

        const bufferTestCases: Array<Record<'base64url' | 'base62x', string>> = JSON.parse(
            NodeFS.readFileSync(`${__dirname}/../test-data/base62x.json`, 'utf8')
        );

        for (const { base64url, base62x } of bufferTestCases) {
            const d = Buffer.from(base64url, 'base64url');
            NodeAssert.strictEqual(enc.bufferToBase62x(d), base62x);
            NodeAssert.strictEqual(enc.bufferFromBase62x(base62x).equals(d), true);
        }

        new WasmBase62xEncoder().bufferFromBase62x('abc'.repeat(65537));
    });

    NodeTest.it('should encode and decode large data correctly', () => {

        const enc = new WasmBase62xEncoder('x');

        // to test the allocation of new memory pages in the wasm module
        for (let i = 0; i < 0x10000 * 5; i += Math.floor(Math.random() * 10240)) {

            const randomString = NodeCrypto.randomBytes(i);
            const encoded = enc.bufferToBase62x(randomString);
            NodeAssert.strictEqual(enc.bufferFromBase62x(encoded).equals(randomString), true);
        }
    });

    NodeTest.it('should throw error if invalid x-tag is used', () => {

        for (const validTag of ['x', 'X', '1', 'a', 'c', 'Z', '9', '0']) {
            new WasmBase62xEncoder(validTag);
        }
        for (const invalidTag of ['', ' ', '~', ' x', 'x ', '!']) {
            NodeAssert.throws(() => new WasmBase62xEncoder(invalidTag));
        }
    });

    NodeTest.it('should throw error if invalid x-tag is used', () => {

        NodeAssert.throws(() => {
            new WasmBase62xEncoder().bufferFromBase62x('_');
        });
    });
});
