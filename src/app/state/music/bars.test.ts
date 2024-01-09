import { describe, it, expect } from "@jest/globals";

import { Bar, Note, Duration, validateBar } from ".";
import { parseTimeSignature, toFullBar } from "./bars";

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