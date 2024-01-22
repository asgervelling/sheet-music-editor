import { Duration, expand, simplify } from "./durations";
import { head, tail } from "./lists";
import { fmtChunk, fmtChunks, fmtEvent } from "./test_helpers";

export enum Note {
  C = "C",
  Db = "D♭",
  D = "D",
  Eb = "E♭",
  E = "E",
  F = "F",
  Gb = "G♭",
  G = "G",
  Ab = "A♭",
  A = "A",
  Bb = "B♭",
  B = "B",
  PAUSE = "PAUSE",
}

/**
 * A musical event is what will eventually be
 * drawn on a musical staff as either a note,
 * a chord or a pause. \
 * It may be tied to the next musical event,
 * indicating that the two should be played
 * as a single sound.
 */
export type MusicalEvent = {
  notes: Note[];
  duration: Duration;
  tiedToNext: boolean;
};

export function chunk(
  events: MusicalEvent[],
  chunkSizes: number[]
): MusicalEvent[][] {
  return simplifyChunks(chunkEvents(events, chunkSizes));
}

/**
 * Divide `events` into `chunkSizes.length` chunks,
 * where the n'th chunk has a total length of chunkSizes[n] 32nd notes.
 */
export function chunkEvents(
  events: MusicalEvent[],
  chunkSizes: number[]
): MusicalEvent[][] {
  if (events.length === 0) {
    // Finished
    return [];
  }

  const expandedEvents = events.map(expandTo32nds);
  const _32ndsInEvents = expandedEvents.flat().length;
  const chunkSizesSum = chunkSizes.reduce((acc, n) => acc + n, 0);
  if (_32ndsInEvents !== chunkSizesSum) {
    throw new Error(
      `Total number of 32nd notes (${_32ndsInEvents}) in events 
      and the sum of chunkSizes (${chunkSizesSum}) must match.`
    );
  }

  const event: MusicalEvent[] = head(expandedEvents);
  const num32nds = event.length;
  const chunkSize = head(chunkSizes);

  if (num32nds === chunkSize) {
    return [event, ...chunkEvents(tail(events), tail(chunkSizes))];
  }
  if (num32nds > chunkSize) {
    const a = event.slice(0, chunkSize);
    const b = event.slice(chunkSize);
    return [
      a,
      ...chunkEvents([...b.flat(), ...tail(events)], tail(chunkSizes)),
    ];
  }
  if (num32nds < chunkSize) {
    const diff = chunkSize - num32nds;
    const lastChunkSizes = [diff, ...tail(chunkSizes)];
    const [a, ...b] = chunkEvents(tail(events), lastChunkSizes);
    return [[...event, ...a], ...b];
  }

  return [];
}

/**
 * Take an event `e` and turn it into a series
 * of 32nd notes that are tied together. \
 * An event with notes C and E and quarter duration
 * would become eight events with notes C and E and 32nd duration.
 */
export function expandTo32nds(e: MusicalEvent): MusicalEvent[] {
  if (e.duration === Duration.ThirtySecond) {
    // Can't expand further
    return [{ ...e, tiedToNext: e.tiedToNext || false }];
  }

  const toEvent = (d: Duration): MusicalEvent => ({
    notes: e.notes,
    duration: d,
    tiedToNext: false,
  });
  const markTied = (e: MusicalEvent): MusicalEvent => ({
    ...e,
    tiedToNext: true,
  });

  const _32nds = expand(e.duration);
  const rev = _32nds.reverse();
  const tied: MusicalEvent[] = tail(rev).map(toEvent).map(markTied);
  const last: MusicalEvent = toEvent(head(rev));

  return [...tied, last];
}

export function simplifyChunks(chunks: MusicalEvent[][]): MusicalEvent[][] {
  let newChunks: MusicalEvent[][] = [];
  for (const chunk of chunks) {
    newChunks.push(simplifyEvents(chunk));
  }
  return newChunks;
}

function simplifyEvents(events: MusicalEvent[]): MusicalEvent[] {
  if (events.length === 0) {
    return [];
  }

  const groups = findEventGroups(events);
  let simplifiedGroups: MusicalEvent[][] = [];
  for (const g of groups) {
    const durations = g.map((e) => e.duration);
    const first: MusicalEvent = head(g);
    simplifiedGroups.push(
      simplify(durations).map((d) => ({
        notes: first.notes,
        duration: d,
        tiedToNext: first.tiedToNext,
      }))
    );
  }
  return simplifiedGroups.map(untieLast).flat();
}

/**
 * Find groups of events that have been split up but belong together. \
 * An event group is either
 * - a series of tied events followed by an untied event, or
 * - a single untied event.
 *
 * Only events with the same notes can be tied. \
 * Therefore, if an event has `tiedToNext: true`, but the next event \
 * does not have the same notes, `event.tiedToNext` will be set to false \
 * and grouped as a single untied event.
 */
export function findEventGroups(events: MusicalEvent[]): MusicalEvent[][] {
  const n = firstGroupLength(events);
  if (n === 0) {
    return [];
  }

  const [group, remainingEvents] = [
    untieLast(events.slice(0, n)),
    events.slice(n),
  ];
  return [group, ...findEventGroups(remainingEvents)];
}

/**
 * Return `events` where the last event has
 * `tiedToNext: false`.
 */
function untieLast(events: MusicalEvent[]): MusicalEvent[] {
  const n = events.length;
  if (n === 0) {
    return [];
  }
  const firstInGroup = events.slice(0, -1);
  const lastInGroup = untie(events[n - 1]);
  return [...firstInGroup, lastInGroup];
}

function untie(e: MusicalEvent): MusicalEvent {
  return { ...e, tiedToNext: false };
}

/**
 * Given an array of events, figure out the number of events
 * it is grouped with, such as
 *
 *   // 3 32nd note E's tied together \
 *   firstGroupLength([e32t, e32t, e32, d32]) -> 3
 *
 *   // A C cannot be tied with a D \
 *   firstGroupLength([c1t, d1t]) -> 1
 *
 * @returns a number greater than 0
 */
export function firstGroupLength(events: MusicalEvent[]): number {
  if (events.length === 0) return 0;

  function countTiedNotes(events: MusicalEvent[], notes: Note[]): number {
    if (events.length === 0) {
      return 0;
    }
    if (head(events).notes.every((note, i) => note === notes[i])) {
      if (head(events).tiedToNext) {
        return 1 + countTiedNotes(tail(events), notes);
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }

  return countTiedNotes(events, head(events).notes);
}
