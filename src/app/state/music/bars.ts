import { Bar, Duration, Note } from ".";
import {
  expandDuration,
  isPowerOfTwo,
  simplifyDurations,
  toDuration,
  toNumber,
} from "./durations";
import { Fraction, MusicalEvent } from "./types";

/**
 * A bar is valid if the sum of the durations
 * of its musical events is equal to the
 * time signature.
 */
export function validateBar(bar: Bar): boolean {
  return barStatus(bar) === BarStatus.Full;
}

/**
 * A time signature is valid if
 * - it is a valid fraction and
 * - the denominator is a power of 2
 * - the numerator is not 0
 */
export function validateTimeSignature(sig: Fraction): boolean {
  const [a, b] = sig;
  return validateFraction(sig) && isPowerOfTwo(b) && a !== 0;
}

/**
 * A fraction is valid if it is a tuple of two integers.
 * The denominator must not be 0.
 */
export function validateFraction(frac: Fraction): boolean {
  const [a, b] = frac;
  return b !== 0 && [a, b].every(Number.isInteger);
}

/**
 * Create a time signature from a string formatted
 * as "n/n".
 * If the formatting is wrong, an error is thrown.
 */
export function parseTimeSignature(sig: string): Fraction {
  const [top, bottom, ...rest] = sig.split("/");
  const [a, b] = [parseInt(top), parseInt(bottom)];

  if (!validateTimeSignature([a, b]) || rest.length > 0) {
    throw new Error(`Invalid time signature ${sig}.`);
  }

  return [a, b];
}

/**
 * Given a bar's timestamp and musical events,
 * find out how much time is yet to be used
 * in the bar, in terms of note durations.
 */
export function timeLeft(bar: Bar): Duration[] {
  const [a, b] = bar.timeSignature;
  const totalBeats: number = bar.events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);

  if (totalBeats >= a / b) {
    return [];
  }

  const beatsLeft = a / b - totalBeats;
  const thirtySecondsLeft = beatsLeft / toNumber(Duration.ThirtySecond);

  const thirtySeconds = Array(thirtySecondsLeft).fill(Duration.ThirtySecond);
  return simplifyDurations(thirtySeconds);
}

export function timeOverflow(bar: Bar): Duration[] {
  const [a, b] = bar.timeSignature;
  const totalBeats: number = bar.events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);

  if (totalBeats < a / b) {
    return [];
  }

  const beatsLeft = totalBeats - a / b;
  const thirtySecondsLeft = beatsLeft / toNumber(Duration.ThirtySecond);

  const thirtySeconds = Array(thirtySecondsLeft).fill(Duration.ThirtySecond);
  return simplifyDurations(thirtySeconds);
}

/**
 * Create a full (valid) bar from the given events
 * and the time signature.
 */
export function toFullBar(bar: Bar): Bar {
  const pause = (d: Duration) => ({ notes: [Note.PAUSE], duration: d });
  return {
    ...bar,
    events: [...bar.events, ...timeLeft(bar).map(pause)],
  };
}

/**
 * Calculate the number of bars the events take up in the given time signature,
 * as a float.
 */
export function numberOfBars(bar: Bar): number {
  const totalBeats: number = bar.events
    .map((e) => e.duration)
    .reduce((acc, d) => acc + toNumber(d), 0);
  const [a, b] = bar.timeSignature;
  const fullBars: number = totalBeats / (a / b);

  return fullBars;
}

export enum BarStatus {
  Incomplete = "Incomplete",
  Full = "Full",
  Overflow = "Overflow",
}

enum Status {
  Incomplete = "Incomplete",
  Full = "Full",
  Overflow = "Overflow",
}

type BarStatuss =
  | { status: BarStatus.Full }
  | { status: BarStatus.Incomplete; events: MusicalEvent[] }
  | { status: BarStatus.Overflow; events: MusicalEvent[] };

/**
 * Figure out whether a bar is full, incomplete or overflowing.
 */
export function barStatus(bar: Bar): BarStatus {
  const fullBars: number = numberOfBars(bar);
  const overflow: number = fullBars - Math.floor(fullBars);

  if (overflow === 0) return BarStatus.Full;
  if (fullBars > 1) return BarStatus.Overflow;
  return BarStatus.Incomplete;
}

export function toBarStatuss(bar: Bar): BarStatuss {
  const fullBars: number = numberOfBars(bar);
  const overflow: number = fullBars - Math.floor(fullBars);

  if (overflow === 0) return { status: BarStatus.Full };
  if (fullBars > 1) return { status: BarStatus.Overflow, events: bar.events };
  return { status: BarStatus.Incomplete, events: bar.events };
}

const head = <T>(l: T[]) => l[0];
const tail = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(1);
};

/**
 * Turn an array of musical events into an array of bars.
 */
export function toBars(events: MusicalEvent[], timeSignature: Fraction) {
  if (events.length === 0) {
    return [];
  }

  if (events.length === 1) {
    const bar: Bar = { timeSignature, events };
    if (barStatus(bar) === BarStatus.Overflow) {
      // Split the note that is too long into two notes.
      // The first note is at the end of the first bar,
      // the second note is at the beginning of the next bar.
      const lastEvent = head(events);
      const b: Bar = { timeSignature, events };
      // timeLeft(b)
      //   .reduce((acc: MusicalEvent[], d) => , [])
    }
    return [{ timeSignature, events }];
  }
  const [x, xs] = [head(events), tail(events)];
}

function toBarss(bars: Bar[]) {
  if (bars.length === 0) {
    return [];
  }
  if (bars.length === 1) {
    const bar = head(bars);
    const [x, xs] = [head(bar.events), tail(bar.events)];
    switch (barStatus(bar)) {
      case BarStatus.Full:
        return [bar];
      case BarStatus.Incomplete:
        return [bar];
      case BarStatus.Overflow:
        return [];
    }
  }
}

/**
 * Split an event after a given array of durations. 
 * @param event An event you want to split
 * @param at An array of durations after which you want to split the event
 * @returns A tuple of event arrays. The first array contains the events
 * with the durations in `at`, the second array contains the
 * events that come after the durations in `at`.
 */
export function splitEvent(
  event: MusicalEvent,
  at: Duration[]
): [MusicalEvent[], MusicalEvent[]] {
  const event32s = expandDuration(event.duration);
  const first32s = at.flatMap(expandDuration);
  const second32s = event32s.slice(first32s.length);

  const fst = simplifyDurations(first32s);
  const snd = simplifyDurations(second32s);

  const toEvent = (d: Duration): MusicalEvent => ({
    notes: event.notes,
    duration: d,
  });
  return [fst.map(toEvent), snd.map(toEvent)];
}
