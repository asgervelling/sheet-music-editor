import { Bar, Duration, Note } from ".";
import {
  expandDuration,
  isPowerOfTwo,
  simplifyDurations,
  timeSignatureToDurations,
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

/**
 * Figure out whether a bar is full, incomplete or overflowing.
 */
export function barStatus(bar: Bar): BarStatus {
  const fullBars: number = numberOfBars(bar);
  const overflow: number = fullBars - Math.floor(fullBars);

  if (fullBars > 1) return BarStatus.Overflow;
  if (overflow === 0) return BarStatus.Full;
  return BarStatus.Incomplete;
}

const head = <T>(l: T[]) => l[0];
const tail = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(1);
};

/**
 * If l is empty, return the default.
 * Otherwise, return the last element of l.
 */
function lastOrDefault<T>(l: T[], default_: T): T {
  const last: T | undefined = l.at(-1);
  if (last === undefined) return default_;
  return last;
}

export function chunk(
  timeSignature: Fraction,
  events_: MusicalEvent[]
): MusicalEvent[][] {
  function toChunks(
    events: MusicalEvent[],
    chunks: MusicalEvent[][]
  ): MusicalEvent[][] {
    if (events.length === 0) {
      return chunks.filter((c) => c.length > 0);
    }
    const [x, xs] = [head(events), tail(events)];
    const prevChunks = chunks.slice(0, -1);
    const chunk = lastOrDefault(chunks, []);
    const bar: Bar = { timeSignature, events: [...chunk, x] };

    switch (barStatus(bar)) {
      case BarStatus.Full:
        return toChunks(xs, [...prevChunks, [...chunk, x], []]);
      case BarStatus.Incomplete:
        return toChunks(xs, [...prevChunks, [...chunk, x]]);
      case BarStatus.Overflow:
        const b: Bar = { timeSignature, events: chunk.slice(0, -1) };
        let [fst, snd] = splitEvent(x, timeLeft(b));

        return toChunks(
          [...snd, ...xs],
          [...prevChunks, [...chunk, ...fst], []]
        );
    }
  }

  return toChunks(events_, [[]]);
}
/**
 * Split a list of events into chunks.
 * Each chunk is a list of events that fit
 * within a bar in the given time signature.
 * If an event's duration is too long to fit in a chunk,
 * it will be split into multiple events
 * and placed across multiple chunks.
 */
export function chunkk(
  timeSignature: Fraction,
  events: MusicalEvent[]
): MusicalEvent[][] {
  const bar = { timeSignature, events };
  const status = barStatus(bar);
  const [x, xs] = [head(events), tail(events)];
  console.log(
    "Status for bar",
    bar.events.map((e) => `${e.duration}, `),
    "is",
    status
  );
  console.log("x, xs:", x, xs);
  if (events.length === 0) {
    return [];
  }
  if (status === BarStatus.Full) {
    return [events];
  }
  if (status === BarStatus.Incomplete) {
    // Get a new time signature that is the time left in the bar
    const k = timeLeft({ timeSignature, events: xs }).reduce(
      (acc, curr) => acc + toNumber(curr),
      0
    );
    const complete: MusicalEvent[] = [x, ...chunk(timeSignature, xs).flat()];
    console.log("Complete", complete);
    console.log("Time left", k);
  }
  // Does the first event overflow too?
  // If so, it needs to be split
  const [fst, snd] = splitEvent(x, timeSignatureToDurations(timeSignature));
  const overflows: boolean = snd.length > 0;
  console.log("fst, snd:", fst, snd);
  console.log("overflows:", overflows);
  if (overflows) {
    return [[...fst], ...chunk(timeSignature, snd)];
  } else {
    return [[x], ...chunk(timeSignature, xs)];
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

export function splitEvents(
  events: MusicalEvent[],
  at: Duration[]
): [MusicalEvent[], MusicalEvent[]] {
  const [fst, snd] = events.reduce(
    ([fst, snd], event) => {
      const [fst_, snd_] = splitEvent(event, at);
      return [[...fst, ...fst_], [...snd, ...snd_]];
    },
    [[], []] as [MusicalEvent[], MusicalEvent[]]
  );
  return [fst, snd];
}