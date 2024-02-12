import { first, head, last, tail, takeAsLongAs } from "./arrays";
import { chunk, expandTo32nds, reciprocalChunk } from "./events";
import { TimeSignature, tsTo32nds } from "./time_signatures";
import { MusicalEvent, NoteName, Clef } from ".";
import { fmtChunk, fmtChunks } from "./test_helpers";

/**
 * A bar has a time signature,
 * a key signature and some musical events.
 */
export type Bar = {
  clef: Clef;
  timeSig: TimeSignature;
  keySig: NoteName;
  events: MusicalEvent[];
};

/**
 * Distribute the `events` into bars based on the time signature `timeSig`. \
 * If the last bar is missing some events, add pauses to it.
 */
export function createBars(
  events: MusicalEvent[],
  clef: Clef,
  timeSig: TimeSignature,
  keySig: NoteName
): Bar[] {
  if (events.length === 0) {
    return [];
  }
  const chunkSize = tsTo32nds(timeSig).length;
  const total32nds = events.flatMap(expandTo32nds).length;
  const numBars = Math.ceil(total32nds / chunkSize);
  const chunkSizes = Array(numBars).fill(chunkSize);
  const chunks = chunk(events, chunkSizes);
  return [
    ...first(chunks),
    [...last(chunks), ...reciprocalChunk(last(chunks), chunkSize)],
  ].map((events) => ({ clef, timeSig, keySig, events }));
}

/**
 * Set the time signature of `bars[i]` to `ts`. \
 * All subsequent bars, until one with a different time signature comes, \
 * will get the time signature. \
 * The bars will be chunked again, and events will land in different bars. \
 * If updating a time signature to a shorter one, extra bars will be added \
 * at the end of the score to make room for the events. Ex:
 *
 *  ```
 *    bars = [{ 4/4: 4 2 4t }, { 4/4: 4 4 2 }]
 *
 *    setTimeSignature(bars, 1, 2/4)
 *    // bars = [{ 4/4: 4, 2, 4t }, { 2/4: 4 4 }, { 2/4: 2 }]
 *
 *    setTimeSignature(bars, 0, 3/4)
 *    // bars = [{ 3/4: 4 2 }, { 2/4: 2 }, { 2/4: 4 4t }, { 2/4: 4 4p }]
 *
 * where
 *    t: event.tiedToNext and
 *    p: pause
 *  ```
 */
export function setTimeSignature(
  bars: Bar[],
  i: number,
  ts: TimeSignature
): Bar[] {
  if (bars.length <= i || i < 0) return [];

  const [a, b] = [bars.slice(0, i), bars.slice(i)];
  const { clef, keySig, timeSig } = head(bars);
  const hasSameTs = (bar: Bar) =>
    bar.timeSig.every((val, i) => val === timeSig[i]);
  const affected = takeAsLongAs(b, hasSameTs);
  const rest = b.slice(affected.length);
  const events = affected.flatMap((bar) => bar.events);
  return [...a, ...createBars(events, clef, ts, keySig), ...rest];
}

export function setKeySignature(bars: Bar[], i: number, keySig: NoteName): Bar[] {
  if (bars.length <= i || i < 0) return [];

  const [a, b] = [bars.slice(0, i), bars.slice(i)];
  const oldKeySig = head(bars).keySig;
  const hasSameKeySig = (bar: Bar) => bar.keySig === oldKeySig;
  const withKeySig = (bar: Bar): Bar => ({ ...bar, keySig })
  const affected = takeAsLongAs(b, hasSameKeySig);
  const rest = b.slice(affected.length);
  return [...a, ...affected.map(withKeySig), ...rest];
}
