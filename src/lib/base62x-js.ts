/**
 * Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ALPHA_CHAR_TABLE = [
    ...'0123456789',
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'abcdefghijklmnopqrstuvwxyz'
];

export const DEFAULT_X_TAG: string = 'x';

/**
 * The encoder (and also the decoder) for base62x encoding,
 * written in native JavaScript (TypeScript).
 *
 * There is also a WebAssembly version of this encoder,
 * just use `WasmBase62xEncoder` instead of this class
 * if you want to use it.
 */
export class Base62xEncoder {

    private readonly _tag: string;

    private readonly _b2aTable: string[];

    private readonly _a2bTable: Record<string, number>;

    public constructor(tag: string = DEFAULT_X_TAG) {

        this._tag = tag;

        const xPos = ALPHA_CHAR_TABLE.indexOf(this._tag);

        this._b2aTable = [
            ...ALPHA_CHAR_TABLE.slice(0, xPos),
            ...ALPHA_CHAR_TABLE.slice(xPos + 1),
            ...[1, 2, 3].map((x) => `${this._tag}${x}`)
        ];

        this._a2bTable = {};

        for (let i = 0; i < this._b2aTable.length; i++) {

            this._a2bTable[this._b2aTable[i]] = i;
        }
    }

    /**
     * Encode a buffer to a string encoded in base62x.
     */
    public bufferToBase62x(data: Buffer): string {

        const ret: string[] = [];

        for (let i = 0; i < data.length; i += 3) {

            switch (data.length - i) {
                case 1:
                    ret.push(
                        this._b2aTable[data[i] >> 2],
                        this._b2aTable[data[i] & 0x03]
                    );
                    break;
                case 2:
                    ret.push(
                        this._b2aTable[data[i] >> 2],
                        this._b2aTable[((data[i] & 0x03) << 4) | (data[i + 1] >> 4)],
                        this._b2aTable[data[i + 1] & 0x0F]
                    );
                    break;
                default: // >= 3
                    ret.push(
                        this._b2aTable[data[i] >> 2],
                        this._b2aTable[((data[i] & 0x03) << 4) | (data[i + 1] >> 4)],
                        this._b2aTable[((data[i + 1] & 0x0F) << 2) | (data[i + 2] >> 6)],
                        this._b2aTable[data[i + 2] & 0x3F]
                    );
                    break;
            }
        }

        return ret.join('');
    }

    /**
     * Decode a base62x encoded string into a buffer.
     *
     * @param input  The string to be decoded, which should be encoded in base62x.
     *
     * @returns {Buffer} The decoded buffer.
     *
     * @throws {RangeError} If the input string is not a valid base62x encoded string.
     */
    public bufferFromBase62x(input: string): Buffer {

        const bytes: number[] = [];

        for (let i = 0; i < input.length; i += 4) {

            const bs: number[] = [];

            for (let j = i; bs.length < 4 && j < input.length; j++) {

                let a = input[j];

                if (a === undefined) {

                    break;
                }

                if (a === this._tag) {

                    a += input[++j];
                    i++;
                }

                const b: number = this._a2bTable[a];

                if (b === undefined) {

                    throw new RangeError('Unrecognizable base62 input.');
                }

                bs.push(b);
            }

            switch (bs.length) {
                case 1:

                    throw new RangeError('Unrecognizable base62 input.');

                case 2:

                    /**
                     * 1111_11_11
                     * 1111_11 11
                     */

                    bytes.push(bs[0] << 2 | bs[1]);

                    break;

                case 3:

                    /**
                     * 1111_11_11 1111_1111
                     * 1111_11 11_1111 1111
                     */

                    bytes.push(
                        bs[0] << 2 | (bs[1] >> 4),
                        ((bs[1] & 0x0F) << 4) | bs[2]
                    );

                    break;

                case 4:

                    /**
                     * 1111_11_11 1111_1111 11_11_1111
                     * 1111_11 11_1111 1111_11 11_1111
                     */

                    bytes.push(
                        bs[0] << 2 | (bs[1] >> 4),
                        ((bs[1] & 0x0F) << 4) | (bs[2] >> 2),
                        ((bs[2] & 0x03) << 6) | bs[3]
                    );

                    break;
            }
        }

        return Buffer.from(bytes);
    }

    /**
     * Convert the bytes of a UTF-8 string to a string encoded in base62x.
     *
     * @param data The UTF-8 string to be converted to a base62x encoded string.
     *
     * @returns The base62x encoded string.
     */
    public stringToBase62x(data: string): string {

        return this.bufferToBase62x(Buffer.from(data));
    }

    /**
     * Convert a base62x encoded string back to a UTF-8 string.
     *
     * @param data The base62x encoded string to be converted.
     *
     * @returns The UTF-8 string converted from the base62x encoded string.
     */
    public stringFromBase62x(data: string): string {
        return this.bufferFromBase62x(data).toString();
    }
}

const enc = new Base62xEncoder();

/**
 * Encode a UTF-8 string into a BASE62x-encoded string.
 *
 * > This method transform the input string into a `Buffer`, and then calls `bufferToBASE62x`.
 *
 * @param data  The string to be encoded.
 *
 * @returns     The BASE62x-encoded string.
 *
 * @see https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
 */
export const stringToBase62x = enc.stringToBase62x.bind(enc);

/**
 * Decode a BASE62x-encoded string into a UTF-8 string.
 *
 * > This method calls `bufferFromBASE62x` to decode the input string into a `Buffer`, and then
 * > converts it to a UTF-8 string.
 *
 * @param data  The BASE62x-encoded string to be decoded.
 *
 * @returns     The decoded UTF-8 string.
 *
 * @throws `RangeError` if the input is not a valid BASE62x-encoded string.
 *
 * @see https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
 */
export const stringFromBase62x = enc.stringFromBase62x.bind(enc);

/**
 * Encode a `Buffer` to a BASE62x-encoded string.
 *
 * @param data  The `Buffer` to be encoded.
 *
 * @returns     The BASE62x encoded string.
 *
 * @see https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
 */
export const bufferToBase62x = enc.bufferToBase62x.bind(enc);

/**
 * Decode a BASE62x-encoded string into a `Buffer`.
 *
 * @param input  The BASE62x-encoded string to be decoded.
 *
 * @returns        The decoded `Buffer`.
 *
 * @throws `RangeError` if the input is not a valid BASE62x-encoded string.
 *
 * @see https://ieeexplore.ieee.org/document/6020065?arnumber=6020065
 */
export const bufferFromBase62x = enc.bufferFromBase62x.bind(enc);
