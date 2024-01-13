import { describe, it, expect } from "@jest/globals";

import { Bar, Note, Duration, validateBar, MusicalEvent } from ".";
import {
  parseTimeSignature,
  toFullBar,
  validateFraction,
  validateTimeSignature,
  timeLeft,
  barStatus,
  BarStatus,
  splitEvent,
  timeOverflow,
  chunk,
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

const p = parseTimeSignature;
const D = Duration;

describe("validateBar", () => {
  it("should validate a bar", () => {
    // Define some musical events
    const e1 = c(D.Whole);
    const e2 = c(D.Half);
    const e4 = c(D.Quarter);
    const e16 = c(D.Sixteenth);

    const validBar: Bar = {
      timeSignature: p("4/4"),
      events: [e4, e4, e4, e4],
    };
    expect(validateBar(validBar)).toBe(true);

    const barTooLong: Bar = {
      timeSignature: p("4/4"),
      events: [e1, e16],
    };
    expect(validateBar(barTooLong)).toBe(false);

    const barTooShort: Bar = {
      timeSignature: p("4/4"),
      events: [e2],
    };
    expect(validateBar(barTooShort)).toBe(false);

    const waltz: Bar = {
      timeSignature: p("3/4"),
      events: [e2, e4],
    };
    expect(validateBar(waltz)).toBe(true);

    const barWeirdTimeSignature: Bar = {
      timeSignature: p("13/16"),
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

describe("p", () => {
  it("should parse time signatures formatted as 'n/n'", () => {
    expect(p("4/4")).toEqual([4, 4]);
    expect(p("3/4")).toEqual([3, 4]);
    expect(p("3/8")).toEqual([3, 8]);
    expect(p("3/16")).toEqual([3, 16]);
    expect(p("3/32")).toEqual([3, 32]);
    expect(p("3/64")).toEqual([3, 64]);
    expect(p("3/128")).toEqual([3, 128]);
    expect(p("3/256")).toEqual([3, 256]);

    expect(() => p("4/5")).toThrow();
    expect(() => p("4/6")).toThrow();
    expect(() => p("0/4")).toThrow();
    expect(() => p("4/0")).toThrow();
    expect(() => p("4")).toThrow();
    expect(() => p("4/")).toThrow();
    expect(() => p("/4")).toThrow();
    expect(() => p("")).toThrow();
  });
});

describe("timeLeft", () => {
  it("should return the time left in a bar", () => {
    expect(
      timeLeft({
        timeSignature: p("4/4"),
        events: [c(D.Quarter), c(D.Sixteenth)],
      })
    ).toEqual([D.Half, D.Eighth, D.Sixteenth]);

    expect(
      timeLeft({
        timeSignature: p("4/4"),
        events: [c(D.Quarter), c(D.Quarter), c(D.Quarter), c(D.Sixteenth)],
      })
    ).toEqual([D.Eighth, D.Sixteenth]);

    expect(
      timeLeft({
        timeSignature: p("15/8"),
        events: [
          c(D.Sixteenth),
          c(D.Sixteenth),
          c(D.Sixteenth),
          c(D.Eighth),
          c(D.Quarter),
          c(D.Quarter),
        ],
      })
    ).toEqual([D.Whole, D.Sixteenth]);

    expect(
      timeLeft({
        timeSignature: p("3/4"),
        events: [c(D.Quarter)],
      })
    ).toEqual([D.Half]);

    expect(
      timeLeft({
        timeSignature: p("1/4"),
        events: [],
      })
    ).toEqual([D.Quarter]);
  });
});

describe("timeOverflow", () => {
  it("should return the time overflow in a bar", () => {
    expect(
      timeOverflow({
        timeSignature: p("4/4"),
        events: [c(D.Half), c(D.Quarter), c(D.ThirtySecond), c(D.Half)],
      })
    ).toEqual([D.Quarter, D.ThirtySecond]);

    expect(
      timeOverflow({
        timeSignature: p("4/4"),
        events: [c(D.Quarter), c(D.Half)],
      })
    ).toEqual([]);

    expect(
      timeOverflow({
        timeSignature: p("15/8"),
        events: [
          c(D.Eighth),
          c(D.Quarter),
          c(D.Quarter),
          c(D.Quarter),
          c(D.Quarter),
          c(D.Whole), // 17/8
        ],
      })
    ).toEqual([D.Quarter]);
  });
});

describe("toFullBar", () => {
  it("should fill a bar with pauses", () => {
    const bar: Bar = {
      timeSignature: p("4/4"),
      events: [c(D.Quarter), c(D.Sixteenth)],
    };
    const fullBar = toFullBar(bar);
    expect(fullBar.events).toEqual([
      event([Note.C], D.Quarter),
      event([Note.C], D.Sixteenth),
      event([Note.PAUSE], D.Half),
      event([Note.PAUSE], D.Eighth),
      event([Note.PAUSE], D.Sixteenth),
    ]);
  });

  it("should not fill a bar that is already full", () => {
    const bar: Bar = {
      timeSignature: p("4/4"),
      events: [c(D.Whole)],
    };
    const fullBar = toFullBar(bar);
    expect(fullBar.events).toEqual([event([Note.C], D.Whole)]);
  });

  it("should not fill a bar that already has too many notes", () => {
    const bar: Bar = {
      timeSignature: p("4/4"),
      events: [c(D.Whole), c(D.Half)],
    };
    expect(toFullBar(bar)).toEqual(bar);
  });

  it("should fill a bar with a strange time signature", () => {
    const bar: Bar = {
      timeSignature: p("31/32"),
      events: [c(D.Quarter)],
    };
    expect(toFullBar(bar).events).toEqual([
      event([Note.C], D.Quarter),
      event([Note.PAUSE], D.Half),
      event([Note.PAUSE], D.Eighth),
      event([Note.PAUSE], D.Sixteenth),
      event([Note.PAUSE], D.ThirtySecond),
    ]);

    const bars: Bar[] = [
      {
        timeSignature: p("4/4"),
        events: [c(D.Whole)],
      },
      {
        timeSignature: p("4/4"),
        events: [c(D.Half), c(D.Half)],
      },
      {
        timeSignature: p("4/4"),
        events: [c(D.Half), c(D.Quarter)], // Missing a quarter note
      },
    ];
  });
});

describe("barStatus", () => {
  it("should return the status of a bar", () => {
    expect(
      barStatus({
        timeSignature: p("4/4"),
        events: [c(D.Half), c(D.Quarter)],
      })
    ).toEqual(BarStatus.Incomplete);

    expect(
      barStatus({
        timeSignature: p("3/4"),
        events: [c(D.Half)],
      })
    ).toEqual(BarStatus.Incomplete);

    expect(
      barStatus({
        timeSignature: p("5/8"),
        events: [c(D.Eighth), c(D.Half)],
      })
    ).toEqual(BarStatus.Full);

    expect(
      barStatus({
        timeSignature: p("4/4"),
        events: [c(D.Whole), c(D.Whole), c(D.Eighth)],
      })
    ).toEqual(BarStatus.Overflow);

    expect(
      barStatus({
        timeSignature: p("4/4"),
        events: [c(D.Whole), c(D.Whole)],
      })
    ).toEqual(BarStatus.Overflow);
  });
});

describe("splitEvent", () => {
  it("should split a whole note after a quarter and an eighth", () => {
    const event: MusicalEvent = c(D.Whole);
    const at: Duration[] = [D.Quarter, D.Eighth];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([c(D.Quarter), c(D.Eighth)]);
    expect(snd).toEqual([c(D.Half), c(D.Eighth)]);
  });

  it("should split a quarter note after a thirty-second", () => {
    const event = c(D.Quarter);
    const at: Duration[] = [D.ThirtySecond];

    /* 
    Event of length 4       = [8, 8] = [16, 16, 16, 16] = [32] * 8
    Split after one 32      = [[32], [32] * 7]
    Second part simplified  = [32, 32, 32, 32, 32, 32, 32]
                            = [16, 16, 16, 32]
                            = [8, 16, 32]
    */

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([c(D.ThirtySecond)]);
    expect(snd).toEqual([c(D.Eighth), c(D.Sixteenth), c(D.ThirtySecond)]);
  });

  it("should split a quarter note after a quarter note", () => {
    const event = c(D.Quarter);
    const at = [D.Quarter];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([event]);
    expect(snd).toEqual([]);
  });

  it("should split a quarter note after no duration", () => {
    const event = c(D.Quarter);
    const at: Duration[] = [];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([]);
    expect(snd).toEqual([event]);
  });

  it("should split a whole note after a whole note", () => {
    const event = c(D.Whole);
    const at = [D.Whole];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([event]);
    expect(snd).toEqual([]);
  });

  it("should split a whole note after a quarter note", () => {
    const event = c(D.Whole);
    const at = [D.Quarter];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([c(D.Quarter)]);
    expect(snd).toEqual([c(D.Half), c(D.Quarter)]);
  });

  it("should split a quarter note after a quarter note", () => {
    const event = c(D.Quarter);
    const at = [D.Quarter];

    const [fst, snd] = splitEvent(event, at);
    expect(fst).toEqual([c(D.Quarter)]);
    expect(snd).toEqual([]);
  });
});

describe("chunk", () => {
  // it("should create a single chunk with no events", () => {
  //   expect(chunk(p("4/4"), [])).toEqual([]);
  // });

  // it("should create a single chunk with a few events", () => {
  //   expect(chunk(p("3/4"), [c(D.Quarter)])).toEqual([[c(D.Quarter)]]);
  //   expect(chunk(p("4/4"), [c(D.Whole)])).toEqual([[c(D.Whole)]]);
  //   expect(chunk(p("4/8"), [c(D.Quarter), c(D.Quarter)])).toEqual([
  //     [c(D.Quarter), c(D.Quarter)],
  //   ]);
  // });

  // it("should create two chunks when overflowing", () => {
  //   expect(chunk(p("4/4"), [c(D.Whole), c(D.Whole)])).toEqual([
  //     [c(D.Whole)],
  //     [c(D.Whole)],
  //   ]);
  // });

  // it("should split events when overflowing", () => {
  //   expect(chunk(p("3/4"), [c(D.Whole)])).toEqual([
  //     [c(D.Half), c(D.Quarter)],
  //     [c(D.Quarter)],
  //   ]);
  // });

  // it("should overflow multiple times without splitting", () => {
  //   expect(chunk(p("1/4"), [c(D.Whole)])).toEqual([
  //     [c(D.Quarter)],
  //     [c(D.Quarter)],
  //     [c(D.Quarter)],
  //     [c(D.Quarter)],
  //   ]);
  // });

  it("should overflow multiple times and split", () => {
    const expected = [
      [c(D.Half), c(D.Eighth)],
      [c(D.Quarter), c(D.Eighth), c(D.Quarter)],
      [c(D.Half), c(D.Eighth)],
      [c(D.Eighth)],
    ];
    console.log("Expected:", expected.map((c) => c.map((event) => `${event.duration}`)));
    console.log("Actual:  ",
      chunk(p("5/8"), [c(D.Whole), c(D.Whole)]).map((c) =>
        c.map((event) => `${event.duration}`)
      )
    );
    expect(chunk(p("5/8"), [c(D.Whole), c(D.Whole)])).toEqual([
      [c(D.Half), c(D.Eighth)],
      [c(D.Quarter), c(D.Eighth), c(D.Quarter)],
      [c(D.Half), c(D.Eighth)],
      [c(D.Eighth)],
    ]);
  });

  // it("should split into parts that overflow", () => {
  //   expect(chunk(p("7/8"), [c(D.Whole), c(D.Whole), c(D.Whole)])).toEqual([
  //     [c(D.Half), c(D.Quarter), c(D.Eighth)],
  //     [c(D.Eighth), c(D.Half), c(D.Quarter)],
  //     [c(D.Quarter), c(D.Half), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],
  //   ]);
  // });

  function printChunks(chunks: MusicalEvent[][]) {
    return console.log(
      chunks.map((chunk) => chunk.map((event) => event.duration))
    );
  }

  // it("should create many chunks when overflowing", () => {
  //   printChunks(chunk(p("3/8"), [c(D.Eighth), c(D.Whole), c(D.Whole)]));
  //   expect(chunk(p("3/8"), [c(D.Eighth), c(D.Whole), c(D.Whole)])).toEqual([
  //     // 8th, whole:
  //     [c(D.Eighth), c(D.Quarter)],
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],

  //     // whole, whole:
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Quarter), c(D.Eighth)],
  //     [c(D.Eighth)],
  //   ]);

  // expect(chunk(p("17/32"), [c(D.Sixteenth), c(D.Whole), c(D.Whole), c(D.Whole)])).toEqual(
  //   [
  //     [c(D.Sixteenth), c(D.Quarter), c(D.Eighth), c(D.Sixteenth), c(D.ThirtySecond)],
  //     [c(D.Half), c(D.ThirtySecond)],
  //     [c(D.Half), c(D.ThirtySecond)],
  //     [c(D.Quarter), c(D.Eighth), c(D.Sixteenth), c(D.ThirtySecond), c(D.Sixteenth)],
  //     [c(D.Half), c(D.ThirtySecond)],
  //     [c(D.Quarter), c(D.Eighth), c(D.ThirtySecond)],
  //   ]
  // );
  // });
});
