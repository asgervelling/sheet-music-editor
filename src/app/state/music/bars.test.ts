import { describe, it, expect } from "@jest/globals";

import { Bar, Note, Duration, validateBar } from ".";
import { parseTimeSignature, toFullBar, validateFraction, validateTimeSignature } from "./bars";

describe("validateBar", () => {
  it("should validate a bar", () => {
    // Define some musical events
    const e1 = { notes: [Note.C], duration: Duration.Whole };
    const e2 = { notes: [Note.C], duration: Duration.Half };
    const e4 = { notes: [Note.C], duration: Duration.Quarter };
    const e16 = { notes: [Note.C], duration: Duration.Sixteenth };

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

    expect(() => parseTimeSignature("4/4/4")).toThrow();
    expect(() => parseTimeSignature("4")).toThrow();
    expect(() => parseTimeSignature("4/")).toThrow();
    expect(() => parseTimeSignature("/4")).toThrow();
    expect(() => parseTimeSignature("")).toThrow();
  });
})

describe("toFullBar", () => {
  it("should fill a bar with pauses", () => {
    const e4 = { notes: [Note.C], duration: Duration.Quarter };
    const e16 = { notes: [Note.C], duration: Duration.Sixteenth };
    const bar: Bar = {
      timeSignature: parseTimeSignature("4/4"),
      events: [e4, e16],
    };
    const fullBar = toFullBar(bar);
    expect(fullBar.events[2].notes[0]).toBe(Note.PAUSE);
    expect(fullBar.events[2].duration).toBe(Duration.Sixteenth);
    expect(fullBar.events.length).toBe(13);
  });
});