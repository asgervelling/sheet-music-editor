import { describe, it, expect } from "@jest/globals";

import {
  chunkEvents,
  expandTo32nds,
  findEventGroups,
  firstGroupLength,
  simplifyChunks,
} from "./events";
import {
  repeat,
  c1,
  c2,
  c4,
  c8,
  c16,
  c32,
  tiedToNext,
  fmtChunk,
  fmtEvent,
  e2,
  e4,
  e16,
  e8,
  e32,
  fmtChunks,
} from "./test_helpers";

const c1t = tiedToNext(c1);
const c2t = tiedToNext(c2);
const c4t = tiedToNext(c4);
const c8t = tiedToNext(c8);
const c16t = tiedToNext(c16);
const c32t = tiedToNext(c32);
const e2t = tiedToNext(e2);
const e32t = tiedToNext(e32);

describe("expandTo32nds", () => {
  it("should expand a 32nd note to an untied 32nd note", () => {
    expect(expandTo32nds(c32)).toEqual([c32]);
  });

  it("should expand a tied 32nd note to a tied 32nd note", () => {
    expect(expandTo32nds(c32t)).toEqual([c32t]);
  });

  it("should expand a 16th note to a tied and an untied 32nd note", () => {
    expect(expandTo32nds(c16)).toEqual([c32t, c32]);
  });

  it("should expand an 8th note to 3 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c8)).toEqual([...repeat(c32t, 3), c32]);
  });

  it("should expand a quarter note to 7 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c4)).toEqual([...repeat(c32t, 7), c32]);
  });

  it("should expand a half note to 15 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c2)).toEqual([...repeat(c32t, 15), c32]);
  });

  it("should expand a whole note to 31 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c1)).toEqual([...repeat(c32t, 31), c32]);
  });
});

describe("chunkEvents", () => {
  it("should divide one event into one chunk", () => {
    expect(chunkEvents([e2], [16])).toEqual([[...repeat(e32t, 15), e32]]);
  });

  it("should divide two events into two chunks", () => {
    expect(chunkEvents([e2, c2], [16, 16])).toEqual([
      [...repeat(e32t, 15), e32],
      [...repeat(c32t, 15), c32],
    ]);
  });

  it("should divide two events into three chunks", () => {
    expect(chunkEvents([e2, c2], [10, 12, 10])).toEqual([
      [...repeat(e32t, 10)],
      [...repeat(e32t, 5), e32, ...repeat(c32t, 6)],
      [...repeat(c32t, 9), c32],
    ]);
  });

  it("should divide three events into one chunkEvents", () => {
    expect(chunkEvents([e4, c4, e4], [24])).toEqual([
      [
        ...repeat(e32t, 7),
        e32,
        ...repeat(c32t, 7),
        c32,
        ...repeat(e32t, 7),
        e32,
      ],
    ]);
  });

  it("should divide three events into two chunks", () => {
    expect(chunkEvents([e4, c4, e4], [11, 13])).toEqual([
      // Three quarter notes, E, C and E,
      // split into two measures of 11/32 and 13/32
      [...repeat(e32t, 7), e32, ...repeat(c32t, 3)],
      [...repeat(c32t, 4), c32, ...repeat(e32t, 7), e32],
    ]);
  });

  it("should throw an error when the events don't match the chunks", () => {
    expect(() => chunkEvents([c4], [1])).toThrow();
    expect(() => chunkEvents([c4], [])).toThrow();
  });

  it("should do some uneven splits", () => {
    expect(chunkEvents([e32, c2], [2, 3, 5, 7])).toEqual([
      [e32, c32t],
      repeat(c32t, 3),
      repeat(c32t, 5),
      [...repeat(c32t, 6), c32],
    ]);
  });

  it("should handle a weird time signature", () => {
    expect(chunkEvents([c1], [11, 11, 10])).toEqual([
      repeat(c32t, 11),
      repeat(c32t, 11),
      [...repeat(c32t, 9), c32],
    ]);
  });
});

describe("firstGroupLength", () => {
  it("should recognize a group of tied events", () => {
    expect(firstGroupLength([e32t, e32t, e32t, e32])).toEqual(4);
  });

  it("should return 1 for an event followed by an event with different notes", () => {
    expect(firstGroupLength([c32, e32])).toEqual(1);
  });

  it("should return 1 for a tied event followed by an event with different notes", () => {
    expect(firstGroupLength([c32t, e32])).toEqual(1);
  });

  it("should return 1 for a tied event followed by a tied event with different notes", () => {
    expect(firstGroupLength([c32t, e32t])).toEqual(1);
  });

  it("should recognize different groups with the same notes", () => {
    expect(firstGroupLength([c16, c16, c4t, c4, c4])).toEqual(1);
    expect(firstGroupLength([c16, c4t, c4, c4])).toEqual(1);
    expect(firstGroupLength([c4t, c4, c4])).toEqual(2);
    expect(firstGroupLength([c4, c4])).toEqual(1);
    expect(firstGroupLength([c4])).toEqual(1);
  });

  it("should recognize a group of events with different lengths", () => {
    expect(firstGroupLength([c32t, c4t, c16])).toEqual(3);
  });

  it("should recognize a group of events with different lengths, then a tied event with different notes", () => {
    expect(firstGroupLength([c32t, c4t, e2t])).toEqual(2);
  });
});

describe("findEventGroups", () => {
  it("should group a single untied event as a single group", () => {
    expect(findEventGroups([c32])).toEqual([[c32]]);
  });

  it("should group a single tied event as a single group consisting of an untied event", () => {
    expect(findEventGroups([c32t])).toEqual([[c32]]);
  });

  it("should not find groups in an empty array", () => {
    expect(findEventGroups([])).toEqual([]);
  });

  it("should recognize tied events and an untied event", () => {
    expect(findEventGroups([c32t, c4t, c16])).toEqual([[c32t, c4t, c16]]);
  });

  it("should recognize untied events with same notes as different groups", () => {
    expect(findEventGroups([c32, c4, c16])).toEqual([[c32], [c4], [c16]]);
  });

  it("should recognize tied events, all with different notes, as different groups", () => {
    expect(findEventGroups([c32t, e2t, c16t])).toEqual([[c32], [e2], [c16]]);
  });

  it("should recognize tied events, as a single group with an untied event at the end", () => {
    expect(findEventGroups([c32t, c32t, c32t])).toEqual([[c32t, c32t, c32]]);
  });
});

describe("simplifyChunks", () => {
  it("should simplify a single chunk", () => {
    expect(simplifyChunks([[c32t, c32t, c32]])).toEqual([[c16t, c32]]);
  });

  it("should simplify a single chunk of events with different durations", () => {
    expect(simplifyChunks([[c8t, c8t, c4t, c32]])).toEqual([[c2t, c32]]);
  });

  it("should simplify multiple chunks", () => {
    console.log(fmtChunks(simplifyChunks([[c8, c8t, c1], [], [e32, e32, c32t, c32t, c16t, e16]])))
    expect(
      simplifyChunks([[c8, c8t, c8t, c1], [], [e32, e32, c32t, c32t, c16t, e16]])
    ).toEqual([[c8, c1t, c4], [], [e32, e32, c8, e16]]);
  });
});
