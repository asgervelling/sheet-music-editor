import { describe, it, expect } from "@jest/globals";

import { Bar, createBars } from "./bars";
import {
  D,
  c1,
  c16,
  c16t,
  c2t,
  c4,
  c4t,
  c8t,
  e1,
  e16,
  e16t,
  e1t,
  e2,
  e2t,
  e8t,
  fmtChunk,
  fmtChunks,
  p4,
  p8,
} from "./test_helpers";
import { TimeSignature } from "./time_signatures";
import { repeat } from "./arrays";

const _3_4: TimeSignature = [3, D.Quarter];
const _3_16: TimeSignature = [3, D.Sixteenth];

function fmtBars(bars: Bar[]) {
  return fmtChunks(bars.map((b) => b.events));
}

describe("createBars", () => {
  it("should fill the last bar with pauses", () => {
    expect(createBars([c1, e1], [3, D.Quarter])).toEqual([
      {
        ts: _3_4,
        events: [c2t, c4t],
      },
      {
        ts: _3_4,
        events: [c4, e2t],
      },
      {
        ts: _3_4,
        events: [e2, p4],
      },
    ]);
  });

  it("should create no bars from no events", () => {
    expect(createBars([], [7, D.Eighth])).toEqual([]);
  });

  it("should split an event over multiple bars", () => {
    expect(createBars([c1], _3_16)).toEqual([
      ...repeat({ ts: _3_16, events: [c8t, c16t] }, 5),
      { ts: _3_16, events: [c16, p8] },
    ]);
  });

  it("should split multiple events over multiple bars", () => {
    expect(createBars([c1, e1t, e1t, e1], _3_16)).toEqual([
      ...repeat({ ts: _3_16, events: [c8t, c16t] }, 5),
      { ts: _3_16, events: [c16, e8t] },
      ...repeat({ ts: _3_16, events: [e8t, e16t] }, 15),
      { ts: _3_16, events: [e16, p8] },
    ]);
  });
});
