import { describe, it, expect } from "@jest/globals";
import { Note, MusicalEvent } from "./events";
import { Bar, chunk, fillChunk, toBars } from "./bars";
import { TimeSignature } from "./time_signatures";
import {
  e2,
  e4,
  e8,
  e16,
  e32,
  c1,
  c2,
  c4,
  c8,
  c16,
  c32,
  p,
  p1,
  p2,
  p4,
  p8,
  p16,
  p32,
  repeat,
  D,
  fmtChunks,
  fmtChunk,
} from "./test_helpers";

describe("repeat", () => {
  it("should create an array of x repeated n times", () => {
    expect(repeat(4, 5)).toEqual([4, 4, 4, 4, 4]);
    expect(repeat("hi", 3)).toEqual(["hi", "hi", "hi"]);
  });
});

describe("chunk", () => {
  it("should divide one event into one chunk", () => {
    expect(chunk([e2], [16])).toEqual([[e2]]);
  });

  it("should divide two events into two chunks", () => {
    expect(chunk([e2, c2], [16, 16])).toEqual([[e2], [c2]]);
  });

  it("should divide two events into three chunks", () => {
    expect(chunk([e2, c2], [10, 12, 10])).toEqual([
      [e4, e16],
      [e8, e16, c8, c16],
      [c4, c16],
    ]);
  });

  it("should divide three events into one chunk", () => {
    expect(chunk([e4, c4, e4], [24])).toEqual([[e4, c4, e4]]);
  });

  it("should divide three events into two chunks", () => {
    expect(chunk([e4, c4, e4], [11, 13])).toEqual([
      // Three quarter notes, E, C and E,
      // split into two measures of 11/32 and 13/32
      [e4, c16, c32],
      [c8, c32, e4],
    ]);
  });

  it("should throw an error when the events don't match the chunks", () => {
    expect(() => chunk([c4], [1])).toThrow();
    expect(() => chunk([c4], [])).toThrow();
  });

  it("should do some uneven splits", () => {
    expect(chunk([e32, c2], [2, 3, 5, 7])).toEqual([
      [e32, c32],
      [c16, c32],
      [c8, c32],
      [c8, c16, c32],
    ]);
  });

  it.only("should handle a weird time signature", () => {
    // console.log(fmtChunks(chunk([c1], [11, 11, 10])));
    expect(chunk([c1], [11, 11, 10])).toEqual([
      [c4, c16, c32],
      [c4, c16, c32],
      [c4, c16],
    ]);
  });
});

describe("fillChunk", () => {
  it("should not fill a full chunk", () => {
    expect(fillChunk([c2], 16)).toEqual([c2]);
    expect(fillChunk([e32, c2], 16)).toEqual([e32, c2]);
  });

  it("should not fill a chunk with size 0", () => {
    expect(fillChunk([c2], 0)).toEqual([c2]);
  });

  it("should fill an empty chunk", () => {
    expect(fillChunk([], 16)).toEqual([p2]);
  });

  it("should fill a chunk with a single note", () => {
    expect(fillChunk([e8], 16)).toEqual([e8, p4, p8]);
  });

  it("should simplify durations", () => {
    expect(fillChunk([c4, e4], 32)).toEqual([c4, e4, p2]);
  });
});

describe("toBars", () => {
  it("should create a bar of pauses from no events", () => {
    expect(toBars([], [4, D.Quarter])).toEqual([
      {
        ts: [4, D.Quarter],
        events: [p1],
      },
    ]);
  });

  it("should create a bar from one incomplete chunk", () => {
    expect(toBars([c2], [7, D.Quarter])).toEqual([
      {
        ts: [7, D.Quarter],
        events: [c2, p1, p4],
      },
    ]);
  });

  it("should create a bar from one complete chunk", () => {
    expect(toBars([c2], [2, D.Quarter])).toEqual([
      {
        ts: [2, D.Quarter],
        events: [c2],
      },
    ]);
  });

  it("should create two bars from two complete chunks", () => {
    expect(toBars([c2, e2], [2, D.Quarter])).toEqual([
      {
        ts: [2, D.Quarter],
        events: [c2],
      },
      {
        ts: [2, D.Quarter],
        events: [e2],
      },
    ]);
  });

  it("should create two bars from three events", () => {
    expect(toBars([c2, e2, c2], [3, D.Quarter])).toEqual([
      {
        ts: [3, D.Quarter],
        events: [c2, e4],
      },
      {
        ts: [3, D.Quarter],
        events: [e4, c2],
      },
    ]);
  });

  it("should create three bars from two events and add a pause", () => {
    const ts: TimeSignature = [2, D.Quarter];
    expect(toBars([c1, e2], ts)).toEqual([
      { ts, events: [c2] },
      { ts, events: [c2] },
      { ts, events: [e2] },
    ]);
  });

  function fmtBar(b: Bar) {
    return `{ ts: ${b.ts}, events: ${fmtChunk(b.events)} }`;
  }

  function fmtBars(bars: Bar[]) {
    return `[\n${bars.map((b) => "  " + fmtBar(b)).join(",\n")}\n]`;
  }

  it("should handle a weird time signature", () => {
    // const ts: TimeSignature = [11, Duration.ThirtySecond];
    // console.log(fmtBars(toBars([c1], ts)));
    // expect(toBars([c1], ts)).toEqual([
    //   { ts, events: [c4, c16, c32] },
    //   { ts, events: [c4, c16, c32] },
    //   { ts, events: [c4, c16] },
    // ]);
    // Total dur:     32 +16 + 8 + 4 + 2 + 1 = 61/32
    // expect(toBars([c1, e2, c4, e8, c16, e32], ts)).toEqual([
    //   { ts, events: [c4, c16, c32] }, // c1
    //   { ts, events: [c4, c16, c32] },
    //   { ts, events: [c4, c16, e32] }, // e2
    //   { ts, events: [e4, e16, e32] },
    //   { ts, events: [e8, c8, c16, c32] }, // c4
    //   { ts, events: [c32, e8, c16, e32, p16, p32] },
    // ]);
  });
});
