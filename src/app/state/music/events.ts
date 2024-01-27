import { Duration, expand, incrementDuration } from "./durations";
import { arrayEquals, first, head, last, tail } from "./arrays";
import { fmtChunk, fmtChunks, fmtEvent, tiedToNext } from "./test_helpers";

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
  return chunkEvents(events, chunkSizes).map(simplify);
}

/**
 * Divide `events` into `chunkSizes.length` chunks,
 * where the n'th chunk has a total of chunkSizes[n] 32nd notes.
 */
export function chunkEvents(
  events: MusicalEvent[],
  chunkSizes: number[]
): MusicalEvent[][] {
  function chunk32nds(
    events: MusicalEvent[],
    chunkSizes: number[]
  ): MusicalEvent[][] {
    if (chunkSizes.length === 0) {
      return [];
    }
    const n = head(chunkSizes);
    const [c, rest] = [events.slice(0, n), events.slice(n)];
    return [c, ...chunk32nds(rest, tail(chunkSizes))];
  }

  const expandedEvents = events.flatMap(expandTo32nds);
  const _32ndsInEvents = expandedEvents.length;
  const chunkSizesSum = chunkSizes.reduce((acc, n) => acc + n, 0);
  if (_32ndsInEvents !== chunkSizesSum) {
    throw new Error(
      `Total number of 32nd notes (${_32ndsInEvents}) in events 
      and the sum of chunkSizes (${chunkSizesSum}) must match.`
    );
  }

  return chunk32nds(expandedEvents, chunkSizes);
}

/**
 * Take an event `e` and turn it into a series
 * of 32nd notes that are tied together. \
 * An event with notes C and E and quarter duration
 * would become eight events with notes C and E and 32nd duration.
 */
export function expandTo32nds(e: MusicalEvent): MusicalEvent[] {
  if (e.duration === Duration.ThirtySecond) {
    // Can't be expanded further
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
  const tied: MusicalEvent[] = first(_32nds).map(toEvent).map(markTied);
  const last_: MusicalEvent = {
    ...toEvent(last(_32nds)),
    tiedToNext: e.tiedToNext,
  };

  return [...tied, last_];
}

/**
 * Simplify an array of events to have
 * the the longest possible durations,
 * by looking at events with shorter durations
 * that are tied together.
 * Music theory:
 * https://en.wikipedia.org/wiki/Tie_(music)
 */
export function simplify(events_: MusicalEvent[]): MusicalEvent[] {
  function simplifyGroup(group: MusicalEvent[], d: Duration): MusicalEvent[] {
    if (group.length < 2 || d === Duration.Whole) {
      return group;
    }

    const [a, ...rest] = group;
    if (!rest.every((e) => arrayEquals(e.notes, a.notes))) {
      throw new Error("A group of tied events must have the same notes");
    }

    // Find the index of an event with the same duration, if any
    const i = rest.findIndex((e) => e.duration === a.duration);
    if (i === -1) {
      const restSimplified = simplifyGroup(rest, d);
      return simplifyGroup([a, ...restSimplified], incrementDuration(d));
    }

    // Upgrade the two events with same duration to a greater duration
    const newGroup = [
      ...rest.slice(0, i),
      ...simplifyPair(a, rest[i]),
      ...rest.slice(i + 1),
    ];
    if (newGroup.length !== group.length) {
      return simplifyGroup(newGroup, d);
    }
    return simplifyGroup(newGroup, incrementDuration(d));
  }

  const groups = groupTiedEvents(events_)
    .map((g) =>
      [...g].sort((a, b) => {
        const durations = Object.values(Duration);
        const aIndex = durations.indexOf(a.duration);
        const bIndex = durations.indexOf(b.duration);
        return bIndex - aIndex;
      })
    )
    .map((g) => simplifyGroup(g, Duration.ThirtySecond));

  const x = groups
    .map((g) =>
      [...g].sort((a, b) => {
        const durations = Object.values(Duration);
        const aIndex = durations.indexOf(a.duration);
        const bIndex = durations.indexOf(b.duration);
        return aIndex - bIndex;
      })
    )
    .map((g, i) => [
      ...first(g).map((e) => ({ ...e, tiedToNext: true })),
      { ...last(g), tiedToNext: last(groups[i]).tiedToNext },
    ])
    .flat();

  return x;
}

/**
 * Create a 2d array, where each array
 * contains events that are tied together.
 */
export function groupTiedEvents(events_: MusicalEvent[]): MusicalEvent[][] {
  function firstGroup(events: MusicalEvent[]): MusicalEvent[] {
    const n = events.length;
    if (n === 0) {
      return [];
    }
    if (n === 1) {
      return [...events];
    }
    const [a, b, ...rest] = events;
    if (a.tiedToNext && arrayEquals(a.notes, b.notes)) {
      return [a, ...firstGroup([b, ...rest])];
    }
    return [a];
  }

  if (events_.length === 0) {
    return [];
  }
  const group = firstGroup(events_);
  const rest = events_.slice(group.length);
  return [group, ...groupTiedEvents(rest)].filter((g) => g.length > 0);
}

export function simplifyPair(a: MusicalEvent, b: MusicalEvent): MusicalEvent[] {
  if (!arrayEquals(a.notes, b.notes)) {
    throw new Error("simplifyPair assumes that a and b have the same notes");
  }

  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(a.duration);
  if (a.duration !== Duration.Whole) {
    // Simplify pair to a greater duration
    return [{ ...b, duration: lowToHigh[i + 1] }];
  } else {
    // Pair cannot be simplified as they are both whole notes
    return [a, b];
  }
}
