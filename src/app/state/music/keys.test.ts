import { describe, it, expect } from "@jest/globals";

import {
  interval,
  isDiatonic,
  stepInKey,
  midiValue,
  // inferAccidentals,
  inferAccidentals,
  Accidental,
  isAscending,
  isDescending,
} from "./keys";
import { Duration, NoteName } from ".";
import { MusicalEvent, Note } from "./events";
import { head, rotate, tail } from "./arrays";
import { c4, db4, e4, e8, event, fmtEvent } from "./test_helpers";

// HARDCODED octave
const n = (name: NoteName, octave: number): Note => ({ name, octave });
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

describe("interval", () => {
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

describe("midiValue", () => {
  it("should have C4 as the middle C", () => {
    const middleC = 60;
    expect(midiValue({ name: NN.C, octave: 4 })).toEqual(middleC);
  });

  it("should have 12 semitones between each C", () => {
    for (let i = -1; i <= 9; i++) {
      expect(midiValue({ name: NN.C, octave: i })).toEqual(12 * (i + 1));
    }
  });

  it("should return a value in the range [0..127]", () => {
    for (let i = -15; i <= 140; i++) {
      const name = Object.values(NoteName)[Math.abs(i) % 12];
      const octave = Math.floor(i / 12) - 1;
      const note: Note = { name, octave };
      if (i < 0) {
        expect(midiValue(note)).toEqual(0);
      } else if (i > 127) {
        expect(midiValue(note)).toEqual(127);
      } else {
        expect(midiValue(note));
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

describe("isAscending", () => {
  it("should return true if note b is higher than note a", () => {
    expect(isAscending(note(NN.C), n(NN.B, 3))).toBe(false);
    expect(isAscending(note(NN.C), note(NN.C))).toBe(false);
    expect(isAscending(note(NN.C), note(NN.Db))).toBe(true);
    expect(isAscending(note(NN.C), note(NN.D))).toBe(true);
    expect(isAscending(note(NN.C), note(NN.E))).toBe(true);
    expect(isAscending(note(NN.C), note(NN.E))).toBe(true);
    expect(isAscending(n(NN.C, 2), n(NN.C, 3))).toBe(true);
    expect(isAscending(n(NN.C, 2), n(NN.C, -1))).toBe(false);
  });
});

describe("isDescending", () => {
  it("should return true if note b is higher than note a", () => {
    expect(isDescending(note(NN.C), n(NN.B, 3))).toBe(true);
    expect(isDescending(note(NN.C), note(NN.C))).toBe(false);
    expect(isDescending(note(NN.C), note(NN.Db))).toBe(false);
    expect(isDescending(note(NN.C), note(NN.D))).toBe(false);
    expect(isDescending(note(NN.C), note(NN.E))).toBe(false);
    expect(isDescending(note(NN.C), note(NN.E))).toBe(false);
    expect(isDescending(n(NN.C, 2), n(NN.C, 3))).toBe(false);
    expect(isDescending(n(NN.C, 2), n(NN.C, -1))).toBe(true);
  });
});

describe("inferAccidentals", () => {
  const e = (names: NoteName[]) => event(names, Duration.Quarter);

  it("should let diatonics be naturals", () => {
    expect(inferAccidentals(c4, db4, NN.C)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(c4, e8, NN.C)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(c4, e8, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.Ab]), e([NN.G, NN.A]), NN.A)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.E]), e([NN.Eb, NN.G]), NN.E)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.E]), e([NN.Eb, NN.F]), NN.E)).toEqual([
      Accidental.Natural,
    ]);
  });

  it("should prefer flats over sharps", () => {
    expect(inferAccidentals(e([NN.Ab]), e([NN.G, NN.A]), NN.G)).toEqual([
      Accidental.Flat,
    ]);
    expect(inferAccidentals(e([NN.E]), e([NN.Eb, NN.Gb]), NN.Eb)).toEqual([
      Accidental.Flat,
    ]);
  });

  it("should use sharps when sequence is ascending and not descending and interval < 3", () => {
    expect(inferAccidentals(e([NN.E]), e([NN.Eb, NN.G]), NN.Eb)).toEqual([
      Accidental.Sharp,
    ]);
  });

  it("should apply to multiple notes in any order", () => {
    function permutations<T>(arr: T[]): T[][] {
      if (arr.length === 1) {
        return [arr];
      }

      return arr.reduce((acc: T[][], current, index) => {
        const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];
        const permutationsOfRest = permutations(rest);
        const permutationsWithCurrent = permutationsOfRest.map((perm) => [
          current,
          ...perm,
        ]);
        return [...acc, ...permutationsWithCurrent];
      }, []);
    }

    const zip = (...arr: any[][]): any[][] =>
      Array(Math.max(...arr.map((a) => a.length)))
        .fill(undefined)
        .map((_, i) => arr.map((a) => a[i]));

    function testPermutations(
      testValues: [MusicalEvent, MusicalEvent, Accidental[]],
      key: NoteName
    ) {
      const [event, prevEvent, accidentals] = testValues;
      const perms: MusicalEvent[] = permutations(event.notes).map((notes) => ({
        ...event,
        notes,
      }));
      const previousPerms: MusicalEvent[] = permutations(prevEvent.notes).map(
        (notes) => ({ ...prevEvent, notes })
      );
      const accidentalPerms: Accidental[][] = permutations(accidentals);

      let i = 0;
      zip(perms, accidentalPerms).forEach((tuple) => {
        const [event, accidentals] = tuple;
        previousPerms.forEach((prevEvent) => {
          console.log(
            `inferAccidentals(${fmtEvent(event)}, ${fmtEvent(
              prevEvent
            )}, ${key}) = [${inferAccidentals(event, prevEvent, key)
              .map((a) => (a === Accidental.Natural ? '""' : a))
              .join(", ")}] (${i})`
          );
          i++;
          expect(inferAccidentals(event, prevEvent, key)).toEqual(accidentals);
        });
      });
    }

    testPermutations(
      [
        e([NN.E, NN.G, NN.B]),
        e([NN.Db, NN.Eb, NN.Gb]),
        [Accidental.Natural, Accidental.Sharp, Accidental.Natural],
      ],
      NN.B
    );

    testPermutations(
      [
        e([NN.C, NN.E, NN.G]),
        e([NN.Db, NN.Eb, NN.Gb]),
        [Accidental.Flat, Accidental.Natural, Accidental.Sharp],
      ],
      NN.B
    );
  });

  it("should infer natural if the note is diatonic", () => {
    // The key of G has the pitches G, A, B, C, D, E, and F♯
    expect(inferAccidentals(e([NN.G]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.A]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.B]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.C]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.D]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.E]), null, NN.G)).toEqual([Accidental.Natural]);
    expect(inferAccidentals(e([NN.Gb]), null, NN.G)).toEqual([
      Accidental.Natural
    ]);
  });

  it("should infer flat if the previous note is null and the note is not diatonic", () => {
    // The key of Ab has the pitches A♭, B♭, C, D♭, E♭, F and G.
    expect(inferAccidentals(e([NN.A]), null, NN.Ab)).toEqual([Accidental.Flat]);
    expect(inferAccidentals(e([NN.B]), null, NN.Ab)).toEqual([Accidental.Flat]);
    expect(inferAccidentals(e([NN.D]), null, NN.Ab)).toEqual([Accidental.Flat]);
    expect(inferAccidentals(e([NN.E]), null, NN.Ab)).toEqual([Accidental.Flat]);
    expect(inferAccidentals(e([NN.Gb]), null, NN.Ab)).toEqual([Accidental.Flat]);
  });

  it("should infer sharp for a non-diatonic note in an ascending sequence with an interval of one semitone", () => {
    // The pitches B, C♯, D♯, E, F♯, G♯, and A♯ are all part of the B major scale
    expect(inferAccidentals(e([NN.Db]), e([NN.C]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.D]), e([NN.Db]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Eb]), e([NN.D]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.E]), e([NN.Eb]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.F]), e([NN.E]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Gb]), e([NN.F]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.G]), e([NN.Gb]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Ab]), e([NN.G]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.A]), e([NN.Ab]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Bb]), e([NN.A]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.B]), e([NN.Bb]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
  });

  it("should infer sharp for a non-diatonic note in an ascending sequence with an interval of two semitones", () => {
    // The pitches B, C♯, D♯, E, F♯, G♯, and A♯ are all part of the B major scale
    expect(inferAccidentals(e([NN.D]), e([NN.C]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Eb]), e([NN.Db]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.E]), e([NN.D]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.F]), e([NN.Eb]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Gb]), e([NN.E]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.G]), e([NN.F]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Ab]), e([NN.Gb]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.A]), e([NN.G]), NN.B)).toEqual([
      Accidental.Sharp,
    ]);
    expect(inferAccidentals(e([NN.Bb]), e([NN.Ab]), NN.B)).toEqual([
      Accidental.Natural,
    ]);
    expect(inferAccidentals(e([NN.B]), e([NN.A]), NN.B)).toEqual([
      Accidental.Natural,
    ]);

    const fromNotes = (notes: Note[]): MusicalEvent => ({
      notes,
      duration: Duration.Quarter,
      tiedToNext: false,
    });

    expect(
      inferAccidentals(fromNotes([n(NN.C, 7)]), fromNotes([n(NN.Bb, 6)]), NN.B)
    ).toEqual([Accidental.Sharp]);
  });
});
