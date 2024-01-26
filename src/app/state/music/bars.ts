import { Duration, lengthIn32nds, simplify, split } from "./durations";
import { MusicalEvent, Note } from "./events";
import { head, tail } from "./arrays";
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
