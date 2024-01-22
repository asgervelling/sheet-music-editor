import { Duration, lengthIn32nds, simplify, split } from "./durations";
import { MusicalEvent, Note } from "./events";
import { TimeSignature, tsTo32nds } from "./time_signatures";

/**
 * A bar has a time signature and some musical events.
 *
 * @param ts Time signature: A fraction where the numerator
 * is an integer greater than 0, and the denominator is
 * a power of two.
 * @param events A musical event is an array of notes (such as [C, E, G])
 * and a duration. In this simple version just focusing
 * on durations, an event is simply an array of durations.
 */
export type Bar = {
  ts: TimeSignature;
  events: MusicalEvent[];
};

/**
 * Create an appropriate amount of bars
 * from an array of events and a time signature. \
 * If the last bar is incomplete, it will be filled with pauses.
 */
export function toBars(events: MusicalEvent[], ts: TimeSignature): Bar[] {
  const chunkSize: number = tsTo32nds(ts).length;
  if (events.length === 0) {
    const events = fillChunk([], chunkSize);
    return [{ ts, events }];
  }

  const createBar = (events: MusicalEvent[]): Bar => ({ ts, events });

  const event32nds: number = lengthIn32nds(events.map((e) => e.duration));
  const quotient = Math.floor(event32nds / chunkSize);
  const remainder = event32nds % chunkSize;

  if (remainder === 0) {
    const chunkSizes: number[] = Array(quotient).fill(chunkSize);
    const chunks = chunk(events, chunkSizes);
    return chunks.map(createBar);
  }

  // Remainder !== 0
  const chunkSizes: number[] = [...Array(quotient).fill(chunkSize), remainder];
  const chunks = chunk(events, chunkSizes);
  const n = chunks.length;
  const c: MusicalEvent[] = chunks[n - 1];
  const lastChunk = fillChunk(c, remainder);
  const firstChunks = chunks.slice(0, n - 1);
  if (firstChunks.length === 0) {
    const ch = fillChunk(chunks[0], chunkSize);
    return [createBar(ch)];
  }
  
  return [...firstChunks, lastChunk].map(createBar);
}

/**
 * Divide an array of events into chunks with the given sizes.
 */
export function chunk(
  events: MusicalEvent[],
  chunkSizes: number[]
): MusicalEvent[][] {
  const lengthEvents = lengthIn32nds(events.map((e) => e.duration));
  const chunkSizesSum = chunkSizes.reduce((acc, n) => acc + n, 0);
  if (lengthEvents !== chunkSizesSum) {
    throw new Error(
      `Total number of 32nd notes (${lengthEvents}) in events and chunkSizes (${chunkSizesSum}) must match`
    );
  }

  if (events.length === 0) {
    // Finished
    return [];
  }

  const event = head(events);
  const num32nds = lengthIn32nds([event.duration]);
  const chunkSize = head(chunkSizes);

  if (num32nds === chunkSize) {
    return [[event], ...chunk(tail(events), tail(chunkSizes))];
  }
  if (num32nds > chunkSize) {
    const first32nds: Duration[] = Array(chunkSize).fill(Duration.ThirtySecond);
    const [a, ...b] = splitEvent(event, first32nds);
    return [a, ...chunk([...b.flat(), ...tail(events)], tail(chunkSizes))];
  }
  if (num32nds < chunkSize) {
    const diff = chunkSize - num32nds;
    const lastChunkSizes = [diff, ...tail(chunkSizes)];
    const [a, ...b] = chunk(tail(events), lastChunkSizes);
    return [[event, ...a], ...b];
  }

  return [];
}

/**
 * Split an event after an array of durations.
 */
function splitEvent(event: MusicalEvent, length: Duration[]): MusicalEvent[][] {
  return split([event.duration], length).map((part) =>
    part.map((d) => ({ ...event, duration: d }))
  );
}

/**
 * Given a possibly incomplete `chunk`, and a `chunkSize` in 32nd notes,
 * fill the rest of the chunk with pauses.
 */
export function fillChunk(
  chunk: MusicalEvent[],
  chunkSize: number
): MusicalEvent[] {
  const length = lengthIn32nds(chunk.map((e) => e.duration));
  if (length < chunkSize) {
    const n = chunkSize - length;
    const missing: Duration[] = simplify(Array(n).fill(Duration.ThirtySecond));
    const pauses: MusicalEvent[] = missing.map((d) => ({
      notes: [Note.PAUSE],
      duration: d,
    }));
    return [...chunk, ...pauses];
  }
  return chunk;
}

const head = <T>(l: T[]) => l[0];
const tail = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(1);
};
