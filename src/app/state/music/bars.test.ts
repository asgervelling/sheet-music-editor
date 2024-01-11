import { describe, it, expect } from "@jest/globals";

import { Flow } from "vexflow";

import { Bar, Note, Duration, validateBar, MusicalEvent } from ".";
import {
  parseTimeSignature,
  toFullBar,
  validateFraction,
  validateTimeSignature,
  timeLeft,
} from "./bars";

/** Helper function to create an event */
const event = (notes: Note[], duration: Duration): MusicalEvent => ({
  notes,
  duration,
});

/**
 * Create an event with the note C
 * and give it a duration.
 */
const c = (d: Duration) => event([Note.C], d);

describe("validateBar", () => {
  it("should validate a bar", () => {
    // Define some musical events
    const e1 = c(Duration.Whole);
    const e2 = c(Duration.Half);
    const e4 = c(Duration.Quarter);
    const e16 = c(Duration.Sixteenth);

    const validBar: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [e4, e4, e4, e4],
    };
    expect(validateBar(validBar)).toBe(true);

    const barTooLong: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [e1, e16],
    };
    expect(validateBar(barTooLong)).toBe(false);

    const barTooShort: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [e2],
    };
    expect(validateBar(barTooShort)).toBe(false);

    const waltz: Bar = {
      timeSignature: parseTimeSignature("3/4"),
      events: [e2, e4],
    };
    expect(validateBar(waltz)).toBe(true);

    const barWeirdTimeSignature: Bar = {
      timeSignature: parseTimeSignature("13/16"),
      events: [e2, e4, e16],
    };
    expect(validateBar(barWeirdTimeSignature)).toBe(true);
  });
});

describe("validateFraction", () => {
  it("should validate a fraction", () => {
    expect(validateFraction([3, 4])).toBe(true);
    expect(validateFraction([4, 4])).toBe(true);
    expect(validateFraction([3, 8])).toBe(true);
    expect(validateFraction([4, 8])).toBe(true);
    expect(validateFraction([5, 16])).toBe(true);
    expect(validateFraction([6, 32])).toBe(true);
    expect(validateFraction([7, 64])).toBe(true);
    expect(validateFraction([8, 128])).toBe(true);
    expect(validateFraction([47, 256])).toBe(true);
    expect(validateFraction([3.0, 8.0])).toBe(true);

    expect(validateFraction([4.1, 4.0])).toBe(false);
    expect(validateFraction([4, 0])).toBe(false);

    expect(validateFraction([4, 5])).toBe(true);
    expect(validateFraction([4, 6])).toBe(true);
    expect(validateFraction([0, 4])).toBe(true);
  });
});

describe("validateTimeSignature", () => {
  it("should validate a time signature", () => {
    // Same values as validateFraction, returning the opposite
    expect(validateTimeSignature([4, 5])).toBe(false);
    expect(validateTimeSignature([4, 6])).toBe(false);
    expect(validateTimeSignature([0, 4])).toBe(false);
  });
});

describe("parseTimeSignature", () => {
  it("should parse time signatures formatted as 'n/n'", () => {
    expect(parseTimeSignature("4/4")).toEqual([4, 4]);
    expect(parseTimeSignature("3/4")).toEqual([3, 4]);
    expect(parseTimeSignature("3/8")).toEqual([3, 8]);
    expect(parseTimeSignature("3/16")).toEqual([3, 16]);
    expect(parseTimeSignature("3/32")).toEqual([3, 32]);
    expect(parseTimeSignature("3/64")).toEqual([3, 64]);
    expect(parseTimeSignature("3/128")).toEqual([3, 128]);
    expect(parseTimeSignature("3/256")).toEqual([3, 256]);

    expect(() => parseTimeSignature("4/5")).toThrow();
    expect(() => parseTimeSignature("4/6")).toThrow();
    expect(() => parseTimeSignature("0/4")).toThrow();
    expect(() => parseTimeSignature("4/0")).toThrow();
    expect(() => parseTimeSignature("4")).toThrow();
    expect(() => parseTimeSignature("4/")).toThrow();
    expect(() => parseTimeSignature("/4")).toThrow();
    expect(() => parseTimeSignature("")).toThrow();
  });
});

describe("timeLeft", () => {
  it("should return the time left in a bar", () => {
    expect(
      timeLeft({
        timeSignature: parseTimeSignature("4/4"),
        events: [c(Duration.Quarter), c(Duration.Sixteenth)],
      })
    ).toEqual([Duration.Half, Duration.Eighth, Duration.Sixteenth]);

    expect(
      timeLeft({
        timeSignature: parseTimeSignature("4/4"),
        events: [
          c(Duration.Quarter),
          c(Duration.Quarter),
          c(Duration.Quarter),
          c(Duration.Sixteenth),
        ],
      })
    ).toEqual([Duration.Eighth, Duration.Sixteenth]);

    expect(
      timeLeft({
        timeSignature: parseTimeSignature("15/8"),
        events: [
          c(Duration.Sixteenth),
          c(Duration.Sixteenth),
          c(Duration.Sixteenth),
          c(Duration.Eighth),
          c(Duration.Quarter),
          c(Duration.Quarter),
        ],
      })
    ).toEqual([Duration.Whole, Duration.Sixteenth]);
  });
});

describe("toFullBar", () => {
  it("should fill a bar with pauses", () => {
    const bar: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [c(Duration.Quarter), c(Duration.Sixteenth)],
    };
    const fullBar = toFullBar(bar);
    expect(fullBar.events).toEqual([
      event([Note.C], Duration.Quarter),
      event([Note.C], Duration.Sixteenth),
      event([Note.PAUSE], Duration.Half),
      event([Note.PAUSE], Duration.Eighth),
      event([Note.PAUSE], Duration.Sixteenth),
    ]);
  });

  it("should not fill a bar that is already full", () => {
    const bar: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [c(Duration.Whole)],
    };
    const fullBar = toFullBar(bar);
    expect(fullBar.events).toEqual([event([Note.C], Duration.Whole)]);
  });

  it("should not fill a bar that already has too many notes", () => {
    const bar: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [c(Duration.Whole), c(Duration.Half)],
    };
    expect(toFullBar(bar)).toEqual(bar);
  });

  it("should fill a bar with a strange time signature", () => {
    const bar: Bar = {
      timeSignature: parseTimeSignature("31/32"),
      events: [c(Duration.Quarter)],
    };
    expect(toFullBar(bar).events).toEqual([
      event([Note.C], Duration.Quarter),
      event([Note.PAUSE], Duration.Half),
      event([Note.PAUSE], Duration.Eighth),
      event([Note.PAUSE], Duration.Sixteenth),
      event([Note.PAUSE], Duration.ThirtySecond),
    ]);
  });
});
