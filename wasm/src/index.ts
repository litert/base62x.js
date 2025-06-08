const DEC_MAPPING_TABLE_OFFSET: u32 = 0x00;
const ENC_MAPPING_TABLE_OFFSET: u32 = 0x80;
const X_TAG_OFFSET: u32 = 0xFF;
const INPUT_OFFSET: u32 = 0x100;

/**
 * Initial the mapping table for base62x encoding.
 *
 * @param char 
 */
export function initTable(xTag: u8): void {

  let i: u32 = 0;

  // build encoding table {0...63} -> [0-9, A-Z, a-z, x1, x2, x3]
  for (let c: u32 = 48; c < 58; c++) { // 0-9
    if (c == xTag) { continue; }
    store<u8>(ENC_MAPPING_TABLE_OFFSET + (i++), c);
  }
  for (let c: u32 = 65; c < 91; c++) { // A-Z
    if (c == xTag) { continue; }
    store<u8>(ENC_MAPPING_TABLE_OFFSET + (i++), c);
  }
  for (let c: u32 = 97; c < 123; c++) { // a-z
    if (c == xTag) { continue; }
    store<u8>(ENC_MAPPING_TABLE_OFFSET + (i++), c);
  }

  i = 0;

  // build decoding table [0-9, A-Z, a-z, x1, x2, x3] -> {0...63}
  for (let c: u32 = 0; c < 128; c++) {

    if (c == xTag) {
      store<u8>(DEC_MAPPING_TABLE_OFFSET + c, 0xFF); // Invalid character
      continue;
    }

    if (
      (c >= 48 && c < 58) || // 0-9
      (c >= 65 && c < 91) || // A-Z
      (c >= 97 && c < 123) // a-z
    ) {

      store<u8>(DEC_MAPPING_TABLE_OFFSET + c, i++);
    }
    else {
      store<u8>(DEC_MAPPING_TABLE_OFFSET + c, 0xFF); // Invalid character
    }
  }

  store<u8>(X_TAG_OFFSET, xTag);
}

export function getXTag(): u8 {
  return load<u8>(X_TAG_OFFSET);
}

export function getReserverMemorySize(): u32 {
  return INPUT_OFFSET;
}

@inline.always() function encode6Bit(offset: u32, xTag: u8, part: u8): u32 {
  if (part > 60) {
    store<u8>(offset++, xTag);
    store<u8>(offset++, part - 12); // Convert 61,62,63 to 1,2,3
  }
  else {
    store<u8>(offset++, load<u8>(ENC_MAPPING_TABLE_OFFSET + part));
  }
  return offset;
}

@inline.always() function readInput(offset: u32): u8 {
  return load<u8>(INPUT_OFFSET + offset);
}

export function encode(len: u32): u32 {

  let xTag: u8 = load<u8>(X_TAG_OFFSET);
  let outOffset: u32 = INPUT_OFFSET + len;
  let t0: u8 = 0;
  let t1: u8 = 0;

  for (let i: u32 = 0; i < len; i += 3) {

    t0 = readInput(i);
    switch (len - i) {
      case 1: {
        // AAAAAA | (0000)AA
        outOffset = encode6Bit(outOffset, xTag, t0 >> 2);
        outOffset = encode6Bit(outOffset, xTag, t0 & 0x03);
        break;
      }
      case 2: {
        // AAAAAA | AABBBB | (00)BBBB
        t1 = readInput(i + 1);
        outOffset = encode6Bit(outOffset, xTag, t0 >> 2);
        outOffset = encode6Bit(outOffset, xTag, ((t0 & 0x03) << 4) | (t1 >> 4));
        outOffset = encode6Bit(outOffset, xTag, t1 & 0x0F);
        break;
      }
      default: { // >= 3
        // AAAAAA | AABBBB | BBBBCC | CCCCCC
        t1 = readInput(i + 1);
        outOffset = encode6Bit(outOffset, xTag, t0 >> 2);
        outOffset = encode6Bit(outOffset, xTag, ((t0 & 0x03) << 4) | (t1 >> 4));
        t0 = readInput(i + 2);
        outOffset = encode6Bit(outOffset, xTag, ((t1 & 0x0F) << 2) | (t0 >> 6));
        outOffset = encode6Bit(outOffset, xTag, t0 & 0x3F);
        break;
      }
    }
  }

  return outOffset - INPUT_OFFSET - len;
}

export function decode(len: u32): i32 {

  let outOffset: u32 = INPUT_OFFSET + len;
  let j: u32 = 0;
  let xTag: u8 = load<u8>(X_TAG_OFFSET);
  let t0: u8 = 0;
  let b0: u8 = 0;
  let b1: u8 = 0;
  let b2: u8 = 0;
  let b3: u8 = 0;

  for (let i: u32 = 0; i < len; j = 0) {

    for (; j < 4 && i < len; i++, j++) {
      t0 = readInput(i);
      if (t0 == xTag) {
        t0 = readInput(i + 1);
        if (t0 < 49 || t0 > 51) {
          return -1; // Invalid tag
        }
        t0 = 12 + t0; // Convert to 61,62,63
        i++;
      }
      else {
        t0 = load<u8>(DEC_MAPPING_TABLE_OFFSET + t0);
        if (t0 == 0xFF) {
          return -2; // invalid input character
        }
      }
      switch (j) {
        case 0: { b0 = t0; break; }
        case 1: { b1 = t0; break; }
        case 2: { b2 = t0; break; }
        case 3: { b3 = t0; break; }
      }
    }

    switch (j) {
      case 4: {
        store<u8>(outOffset++, (b0 << 2) | (b1 >> 4));
        store<u8>(outOffset++, ((b1 & 0xF) << 4) | (b2 >> 2));
        store<u8>(outOffset++, ((b2 & 0x3) << 6) | b3);
        break;
      }
      case 3: {
        store<u8>(outOffset++, (b0 << 2) | (b1 >> 4));
        store<u8>(outOffset++, ((b1 & 0xF) << 4) | b2);
        break;
      }
      case 2: {
        store<u8>(outOffset++, (b0 << 2) | b1);
        break;
      }
    }
  }

  return outOffset - INPUT_OFFSET - len;
}
