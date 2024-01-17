import { describe, it, expect } from "@jest/globals";
import { Note, MusicalEvent, chunk } from "./bars";
import { Duration } from "./durations";

function repeat<T>(x: T, n: number): T[] {
  function createArray<T>(a: T[], n: number) {
    if (n === 1) return a;
    return createArray([...a, a[0]], n - 1);
  }

  return createArray([x], n);
}

function note(notes: Note[], duration: Duration): MusicalEvent {
  return { notes, duration };
}
const c = (d: Duration) => note([Note.C], d);
const e = (d: Duration) => note([Note.E], d);
const D = Duration;

const e2 = e(D.Half);
const e4 = e(D.Quarter);
const e8 = e(D.Eighth);
const e16 = e(D.Sixteenth);
const e32 = e(D.ThirtySecond);
const c2 = c(D.Half);
const c4 = c(D.Quarter);
const c8 = c(D.Eighth);
const c16 = c(D.Sixteenth);
const c32 = c(D.ThirtySecond);

describe("repeat", () => {
  it("should create an array of x repeated n times", () => {
    expect(repeat(4, 5)).toEqual([4, 4, 4, 4, 4]);
    expect(repeat("hi", 3)).toEqual(["hi", "hi", "hi"]);
  });
});

describe("chunk", () => {
  function fmtEvent(e: MusicalEvent) {
    return `([${e.notes.join(", ")}], ${e.duration})`;
  }

  function fmtChunk(c: MusicalEvent[]) {
    return `[${c.map(fmtEvent).join(", ")}]`;
  }

  function fmtChunks(chunks: MusicalEvent[][]) {
    return `[\n${chunks.map((c) => "  " + fmtChunk(c)).join(",\n")}\n]`;
  }

  function dbgChunk(events: MusicalEvent[], chunkSizes: number[]) {
    console.log(`chunk(${fmtChunk(events)}, [${chunkSizes}])`);
    console.log(fmtChunks(chunk(events, chunkSizes)), "\n");
  }

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
});
