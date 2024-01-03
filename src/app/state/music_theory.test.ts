import { describe, it, expect } from "@jest/globals";

import { Bar, Note, Duration } from "./music_theory";
import { validateBar } from "./music_theory";

describe("Music Theory Tests", () => {
  it("should validate a bar", () => {
    const validBar: Bar = {
      timeSignature: "4/4",
      events: [
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
      ],
    };

    expect(validateBar(validBar)).toBe(true);

    const invalidBar: Bar = {
      timeSignature: "4/4",
      events: [
        {
          notes: [Note.C],
          duration: Duration.Whole,
        },
        {
          notes: [Note.C],
          duration: Duration.Sixteenth,
        },
      ],
    };

    expect(validateBar(invalidBar)).toBe(false);
  });
});