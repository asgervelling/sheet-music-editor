import { first, last } from "./arrays";
import { Duration } from "./durations";
import { MusicalEvent, chunk, expandTo32nds, reciprocalChunk } from "./events";
import { c4, e2 } from "./test_helpers";
import { TimeSignature, tsTo32nds } from "./time_signatures";

/**
 * A bar has a time signature and some musical events.
 */
export type Bar = {
  ts: TimeSignature;
  events: MusicalEvent[];
};

/**
 * Distribute the `events` into bars based on the time signature `ts`. \
 * If the last bar is missing some events, add pauses to it.
 */
export function createBars(events_: MusicalEvent[], ts: TimeSignature): Bar[] {
  if (events_.length === 0) {
    return [];
  }
  const chunkSize = tsTo32nds(ts).length;
  const total32nds = events_.flatMap(expandTo32nds).length;
  const numBars = Math.ceil(total32nds / chunkSize);
  const chunkSizes = Array(numBars).fill(chunkSize);
  const chunks = chunk(events_, chunkSizes);
  const lastChunk = [...last(chunks), ...reciprocalChunk(last(chunks), chunkSize)]
  const bars = [
    ...first(chunks),
    [...last(chunks), ...reciprocalChunk(last(chunks), chunkSize)],
  ].map((events) => ({ ts, events }));
  return bars;
}
