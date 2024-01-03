import { describe, it, expect } from "@jest/globals";

import { Bar, Note, Duration } from "./music_theory";
import { validateBar } from "./music_theory";

describe("Music Theory Tests", () => {
  it("should validate a bar", () => {
    // Define some musical events
    const e1 = { notes: [Note.C], duration: Duration.Whole };
    const e2 = { notes: [Note.C], duration: Duration.Half };
    const e4 = { notes: [Note.C], duration: Duration.Quarter };
    const e16 = { notes: [Note.C], duration: Duration.Sixteenth };

    const validBar: Bar = {
      timeSignature: "4/4",
      events: [e4, e4, e4, e4],
    };
    expect(validateBar(validBar)).toBe(true);

    const barTooLong: Bar = {
      timeSignature: "4/4",
      events: [e1, e16],
    };
    expect(validateBar(barTooLong)).toBe(false);

    const barTooShort: Bar = {
      timeSignature: "4/4",
      events: [e2],
    };
    expect(validateBar(barTooShort)).toBe(false);

    const waltz: Bar = {
      timeSignature: "3/4",
      events: [e2, e4],
    };
    expect(validateBar(waltz)).toBe(true);

    const barWeirdTimeSignature: Bar = {
      timeSignature: "13/16",
      events: [e2, e4, e16],
    };
    expect(validateBar(barWeirdTimeSignature)).toBe(true);
  });
});