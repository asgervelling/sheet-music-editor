import { first, last } from "./arrays";
import { MusicalEvent, chunk, expandTo32nds, reciprocalChunk } from "./events";
import { NoteName } from "./notes";
import { TimeSignature, tsTo32nds } from "./time_signatures";

/**
 * A bar has a time signature,
 * a key signature and some musical events.
 */
export type Bar = {
  timeSig: TimeSignature;
  keySig: NoteName;
  events: MusicalEvent[];
};

/**
 * Distribute the `events` into bars based on the time signature `timeSig`. \
 * If the last bar is missing some events, add pauses to it.
 */
export function createBars(events_: MusicalEvent[], timeSig: TimeSignature, keySig: NoteName): Bar[] {
  if (events_.length === 0) {
    return [];
  }
  const chunkSize = tsTo32nds(timeSig).length;
  const total32nds = events_.flatMap(expandTo32nds).length;
  const numBars = Math.ceil(total32nds / chunkSize);
  const chunkSizes = Array(numBars).fill(chunkSize);
  const chunks = chunk(events_, chunkSizes);
  return [
    ...first(chunks),
    [...last(chunks), ...reciprocalChunk(last(chunks), chunkSize)],
  ].map((events) => ({ timeSig, keySig, events }));

}