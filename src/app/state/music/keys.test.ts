import { describe, it, expect } from "@jest/globals";

import { interval, isDiatonic, stepInKey, toMIDIValue } from "./keys";
import { NoteName } from ".";
import { Note } from "./events";
import { rotate } from "./arrays";

// HARDCODED octave
const note = (name: NoteName): Note => ({ name, octave: 4 });
const NN = NoteName;

describe("stepInKey", () => {
  it("should give the correct step", () => {
    expect(stepInKey(NN.D, NN.G)).toEqual("5");
    expect(stepInKey(NN.G, NN.D)).toEqual("4");
    expect(stepInKey(NN.D, NN.D)).toEqual("1");
    expect(stepInKey(NN.D, NN.Eb)).toEqual("7");
    expect(stepInKey(NN.D, NN.E)).toEqual("b7");
    expect(stepInKey(NN.D, NN.C)).toEqual("2");
    expect(stepInKey(NN.D, NN.Db)).toEqual("b2");
  });

  it("should return C's step in all keys", () => {
    expect(stepInKey(NN.C, NN.C)).toEqual("1");
    expect(stepInKey(NN.C, NN.Db)).toEqual("7");
    expect(stepInKey(NN.C, NN.D)).toEqual("b7");
    expect(stepInKey(NN.C, NN.Eb)).toEqual("6");
    expect(stepInKey(NN.C, NN.E)).toEqual("b6");
    expect(stepInKey(NN.C, NN.F)).toEqual("5");
    expect(stepInKey(NN.C, NN.Gb)).toEqual("b5");
    expect(stepInKey(NN.C, NN.G)).toEqual("4");
    expect(stepInKey(NN.C, NN.Ab)).toEqual("3");
    expect(stepInKey(NN.C, NN.A)).toEqual("b3");
    expect(stepInKey(NN.C, NN.Bb)).toEqual("2");
    expect(stepInKey(NN.C, NN.B)).toEqual("b2");
  });
});

describe.only("interval", () => {
  const n = (name: NoteName, octave: number): Note => ({ name, octave });

  it("should give the correct interval", () => {
    expect(interval(n(NN.A, 4), n(NN.Db, 5))).toEqual(4);
    expect(interval(n(NN.A, 4), n(NN.Db, 4))).toEqual(8);
    expect(interval(n(NN.A, 4), n(NN.Db, 3))).toEqual(20);
    expect(interval(n(NN.E, 4), n(NN.F, 4))).toEqual(1);
    expect(interval(n(NN.G, 4), n(NN.Gb, 4))).toEqual(1);
    expect(interval(n(NN.G, 4), n(NN.F, 4))).toEqual(2);
    expect(interval(n(NN.F, 4), n(NN.G, 4))).toEqual(2);

    expect(interval(n(NN.F, 4), n(NN.F, 4))).toEqual(0);
    expect(interval(n(NN.F, 4), n(NN.Gb, 4))).toEqual(1);
    expect(interval(n(NN.F, 4), n(NN.G, 4))).toEqual(2);
    expect(interval(n(NN.F, 4), n(NN.Ab, 4))).toEqual(3);
    expect(interval(n(NN.F, 4), n(NN.A, 4))).toEqual(4);
    expect(interval(n(NN.F, 4), n(NN.Bb, 4))).toEqual(5);
    expect(interval(n(NN.F, 4), n(NN.B, 4))).toEqual(6);
    expect(interval(n(NN.F, 4), n(NN.C, 5))).toEqual(7);
    expect(interval(n(NN.F, 4), n(NN.Db, 5))).toEqual(8);
    expect(interval(n(NN.F, 4), n(NN.D, 5))).toEqual(9);
    expect(interval(n(NN.F, 4), n(NN.Eb, 5))).toEqual(10);
    expect(interval(n(NN.F, 4), n(NN.E, 5))).toEqual(11);
  });
});

describe("toMIDIValue", () => {
  it("should have C4 as the middle C", () => {
    const middleC = 60;
    expect(toMIDIValue({ name: NN.C, octave: 4 })).toEqual(middleC);
  });

  it("should have 12 semitones between each C", () => {
    for (let i = -1; i <= 9; i++) {
      expect(toMIDIValue({ name: NN.C, octave: i })).toEqual(12 * (i + 1));
    }
  });

  it("should return a value in the range [0..127]", () => {
    for (let i = -15; i <= 140; i++) {
      const name = Object.values(NoteName)[Math.abs(i) % 12];
      const octave = Math.floor(i / 12) - 1;
      const note: Note = { name, octave };
      if (i < 0) {
        expect(toMIDIValue(note)).toEqual(0);
      } else if (i > 127) {
        expect(toMIDIValue(note)).toEqual(127);
      } else {
        expect(toMIDIValue(note));
      }
    }
  });
});

describe("isDiatonic", () => {
  it("should describe all white keys in C as diatonic", () => {
    expect(isDiatonic(NN.C, NN.C)).toBe(true);
    expect(isDiatonic(NN.Db, NN.C)).toBe(false);
    expect(isDiatonic(NN.D, NN.C)).toBe(true);
    expect(isDiatonic(NN.Eb, NN.C)).toBe(false);
    expect(isDiatonic(NN.E, NN.C)).toBe(true);
    expect(isDiatonic(NN.F, NN.C)).toBe(true);
    expect(isDiatonic(NN.Gb, NN.C)).toBe(false);
    expect(isDiatonic(NN.G, NN.C)).toBe(true);
    expect(isDiatonic(NN.Ab, NN.C)).toBe(false);
    expect(isDiatonic(NN.A, NN.C)).toBe(true);
    expect(isDiatonic(NN.Bb, NN.C)).toBe(false);
    expect(isDiatonic(NN.B, NN.C)).toBe(true);
    expect(isDiatonic(NN.PAUSE, NN.C)).toBe(false);
  });

  it("should recognize the pattern of diatonics in the other scales", () => {
    const noteNames = Object.values(NoteName).slice(0, 12);

    const diatonics = (key: NoteName) =>
      noteNames.map((name) => isDiatonic(name, key));

    for (let i = 0; i < noteNames.length - 1; i++) {
      const [key, nextKey] = [noteNames[i], noteNames[i + 1]];
      expect(diatonics(key)).toEqual(rotate(diatonics(nextKey), 1));
    }
  });
});
