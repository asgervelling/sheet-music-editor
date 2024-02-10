import { describe, it, expect } from "@jest/globals";

import { createBars } from "./bars";
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
  p4,
  p8,
} from "./test_helpers";
import { repeat } from "./arrays";
import { Clef, NoteName, TimeSignature } from ".";

const _3_4: TimeSignature = [3, D.Quarter];
const _3_16: TimeSignature = [3, D.Sixteenth];

describe("createBars", () => {
  it("should fill the last bar with pauses", () => {
    expect(
      createBars([c1, e1], Clef.Treble, [3, D.Quarter], NoteName.C)
    ).toEqual([
      {
        clef: Clef.Treble,
        timeSig: _3_4,
        keySig: NoteName.C,
        events: [c4t, c2t],
      },
      {
        clef: Clef.Treble,
        timeSig: _3_4,
        keySig: NoteName.C,
        events: [c4, e2t],
      },
      {
        clef: Clef.Treble,
        timeSig: _3_4,
        keySig: NoteName.C,
        events: [e2, p4],
      },
    ]);
  });

  it("should create no bars from no events", () => {
    expect(createBars([], Clef.Treble, [7, D.Eighth], NoteName.C)).toEqual([]);
  });

  it("should split an event over multiple bars", () => {
    expect(createBars([c1], Clef.Treble, _3_16, NoteName.C)).toEqual([
      ...repeat({ clef: Clef.Treble, timeSig: _3_16, keySig: NoteName.C, events: [c16t, c8t] }, 5),
      {
        clef: Clef.Treble,
        timeSig: _3_16,
        keySig: NoteName.C,
        events: [c16, p8],
      },
    ]);
  });

  it("should split multiple events over multiple bars", () => {
    expect(
      createBars([c1, e1t, e1t, e1], Clef.Treble, _3_16, NoteName.C)
    ).toEqual([
      ...repeat(
        {
          clef: Clef.Treble,
          timeSig: _3_16,
          keySig: NoteName.C,
          events: [c16t, c8t],
        },
        5
      ),
      {
        clef: Clef.Treble,
        timeSig: _3_16,
        keySig: NoteName.C,
        events: [c16, e8t],
      },
      ...repeat(
        {
          clef: Clef.Treble,
          timeSig: _3_16,
          keySig: NoteName.C,
          events: [e16t, e8t],
        },
        15
      ),
      {
        clef: Clef.Treble,
        timeSig: _3_16,
        keySig: NoteName.C,
        events: [e16, p8],
      },
    ]);
  });
});
