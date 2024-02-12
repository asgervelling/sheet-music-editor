import { describe, it, expect } from "@jest/globals";

import { createBars, setTimeSignature } from "./bars";
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
  p2,
  p4,
  p8,
} from "./test_helpers";
import { repeat } from "./arrays";
import { Bar, Clef, MusicalEvent, NoteName, TimeSignature } from ".";

const _2_4: TimeSignature = [2, D.Quarter];
const _3_4: TimeSignature = [3, D.Quarter];
const _3_16: TimeSignature = [3, D.Sixteenth];
const _4_4: TimeSignature = [4, D.Quarter];

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

describe("setTimeSignature", () => {
  const bar = (events: MusicalEvent[], timeSig: TimeSignature): Bar => ({
    clef: Clef.Treble,
    timeSig: timeSig,
    keySig: NoteName.C,
    events,
  });

  it("should add more bars if the new TS is shorter", () => {
    const bars = [bar([c4, c4, c4, c4], _4_4), bar([c4, c4, c4, c4], _4_4)];
    expect(setTimeSignature(bars, 1, _2_4)).toEqual([
      bar([c4, c4, c4, c4], _4_4),
      bar([c4, c4], _2_4),
      bar([c4, c4], _2_4),
    ]);
  });

  it("should add more bars if the new TS is shorter and bars.length === 1", () => {
    const bars = [bar([c4, c4, c4, c4], _4_4)];
    expect(setTimeSignature(bars, 0, _2_4)).toEqual([
      bar([c4, c4], _2_4),
      bar([c4, c4], _2_4),
    ]);
  });

  it("should add pauses to any straggling bar that may have been created", () => {
    const bars = [bar([c4, c4, c4, c4], _4_4)];
    expect(setTimeSignature(bars, 0, _3_4)).toEqual([
      bar([c4, c4, c4], _3_4),
      bar([c4, p2], _3_4),
    ]);
  });
});
