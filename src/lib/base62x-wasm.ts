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
import * as NodeFS from 'node:fs';

let wasmModule: WebAssembly.Module;

export const DEFAULT_X_TAG: string = 'x';

interface IWasmApis {

    readonly memory: WebAssembly.Memory;

    initTable(xTag: number): void;

    getXTag(): number;

    getReserverMemorySize(): number;

    encode(len: number): number;

    decode(len: number): number;
}

/**
 * The encoder (and also the decoder) for base62x encoding,
 * written in WebAssembly.
 */
export class WasmBase62xEncoder {

    private readonly _tag: number;

    /**
     * Allocated pages for the WebAssembly memory.
     * The initial value is 1, which means 64K memory is allocated.
     *
     * > A page in WebAssembly is 64 KiB (65536 bytes).
     */
    private _allocPages: number = 1;

    private readonly _wasmInst: WebAssembly.Instance;

    private readonly _apis: IWasmApis;

    public constructor(tag: string = DEFAULT_X_TAG) {

        this._tag = tag.charCodeAt(0);

        if (tag.length !== 1 || !(
            (this._tag >= 48 && this._tag < 58) || // 0-9
            (this._tag >= 65 && this._tag < 91) || // A-Z
            (this._tag >= 97 && this._tag < 123) // a-z
        )) {
            throw new RangeError(`Invalid tag: ${tag}`);
        }

        this._tag = tag.charCodeAt(0);

        wasmModule ??= new WebAssembly.Module(NodeFS.readFileSync(`${__dirname}/../wasm/base62x.wasm`));

        this._wasmInst = new WebAssembly.Instance(wasmModule, {});

        this._apis = this._wasmInst.exports as unknown as IWasmApis;

        this._apis.memory.grow(1); // Allocate 64K memory for the first time.

        this._apis.initTable(this._tag);
    }

    /**
     * Encode a buffer to a string encoded in base62x.
     */
    public bufferToBase62x(data: Buffer): string {

        const RMS = this._apis.getReserverMemorySize();

        // Prepare memory for decoding: RMS + input length + expected output length.
        // The expected output length is 4/3 ~ 8/3 of the input length.
        // Then the most safe way is to allocate 8/3 of the input length as the expected output length.
        // However, to reduce the calculation, just use the 3x (9/3, 300%) as the expected output length,
        // So, the final memory size will be: RMS + input length * 3 + input length.
        const minMemPages = Math.ceil((RMS + data.byteLength * 4) / 65536);

        if (minMemPages > this._allocPages) {

            this._apis.memory.grow(minMemPages - this._allocPages);
            this._allocPages = minMemPages;
        }

        data.copy(Buffer.from(this._apis.memory.buffer, RMS, data.byteLength));
        const outLength = this._apis.encode(data.byteLength);
        return Buffer.from(this._apis.memory.buffer, RMS + data.byteLength, outLength).toString('utf8');
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

        const RMS = this._apis.getReserverMemorySize();
        const inLength = Buffer.byteLength(input);

        // Prepare memory for decoding: RMS + input length + expected output length.
        // The expected output length is 3/8 ~ 3/4 of the input length, which means the maximum
        // output length is 3/4 of the input length.
        // However, to simplify the calculation, just use the same as the expected output length,
        // So, the final memory size will be: RMS + input length * 2.
        const minMemPages = Math.ceil((inLength * 2 + RMS) / 65536);

        if (minMemPages > this._allocPages) {

            this._apis.memory.grow(minMemPages - this._allocPages);
            this._allocPages = minMemPages;
        }

        // copy the input string to the wasm memory (starting from RMS, ending at RMS + inLength).
        Buffer.from(this._apis.memory.buffer, RMS, inLength).write(input);

        const outLength = this._apis.decode(inLength);
        if (outLength < 0) {

            throw new TypeError('Invalid input data for base62x encoding.');
        }

        // read the result from the wasm memory (starting from RMS + inLength, ending at RMS + inLength + outLength).
        return Buffer.from(this._apis.memory.buffer, RMS + inLength, outLength);
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

const enc = new WasmBase62xEncoder();

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
