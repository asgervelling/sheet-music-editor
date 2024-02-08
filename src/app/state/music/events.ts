import { Duration, expandDuration, incrementDuration } from "./durations";
import * as A from "./arrays";

/**
 * All the pitch classes C, Db, ..., B as well as PAUSE.
 */
export enum NoteName {
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
 * All the pitch classes C, Db, ..., B.
 */
export const pitches: NoteName[] = [
  NoteName.C,
  NoteName.Db,
  NoteName.D,
  NoteName.Eb,
  NoteName.E,
  NoteName.F,
  NoteName.Gb,
  NoteName.G,
  NoteName.Ab,
  NoteName.A,
  NoteName.Bb,
  NoteName.B,
];

/**
 * The lowest note in MIDI is 0 (C/-1) \
 * and the highest is 127 (G/9).
 *
 * We stick to the convention that middle C is C/4
 * and has the MIDI value 60.
 *
 * Helpful chart that follows the same convention:
 * https://syntheway.com/MIDI_Keyboards_Middle_C_MIDI_Note_Number_60_C4.htm
 */

/**
 * A note is the name of the note (or pause) and an octave.
 */
export type Note = {
  name: NoteName;
  octave: number;
};

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

export function isPause(e: MusicalEvent): boolean {
  return e.notes.some((n) => n.name === NoteName.PAUSE);
}

export function noteEquals(a: Note, b: Note): boolean {
  return a.name === b.name && a.octave === b.octave;
}

/**
 * Divide `events` into `chunkSizes.length` chunks,
 * where each chunk has a total duration of the same length
 * as `chunkSize[i]` 32nd notes.
 */
export function chunk(
  events: MusicalEvent[],
  chunkSizes: number[]
): MusicalEvent[][] {
  return A.chunk(events.flatMap(expandTo32nds), chunkSizes).map(simplify);
}

/**
 * Given a `chunk` and a `chunkSize` in 32nd notes, \
 * return a second chunk that completes the first one. \
 * If `chunk` is full, an empty chunk is returned. \
 * If `chunk` is 3/4 full, a chunk containing a 1/4 pause is returned, \
 * to fill out the `chunk`.
 */
export function reciprocalChunk(
  chunk: MusicalEvent[],
  chunkSize: number
): MusicalEvent[] {
  const sizeOf = (chunk: MusicalEvent[]): number =>
    chunk.flatMap(expandTo32nds).length;
  const missing32nds: number = chunkSize - sizeOf(chunk);
  if (missing32nds < 1) {
    return [];
  }
  // HARDCODED octave
  const _32ndPauses: MusicalEvent[] = A.repeat(
    {
      notes: [{ name: NoteName.PAUSE, octave: 4 }],
      duration: Duration.ThirtySecond,
      tiedToNext: false,
    },
    missing32nds
  );
  return simplify(tieGroup(_32ndPauses));
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

    const i = group.findIndex((e) => e.duration === d);
    if (i === -1) {
      return simplifyGroup(group, incrementDuration(d));
    }
    const a = group[i];
    const rest = [...group.slice(0, i), ...group.slice(i + 1)];

    // Find the index of an event with the same duration, if any
    const j = rest.findIndex((e) => e.duration === a.duration);
    if (j === -1) {
      return simplifyGroup(
        [a, ...simplifyGroup(rest, d)],
        incrementDuration(d)
      );
    }

    // Upgrade the two events with same duration to a greater duration
    const newGroup = [
      ...rest.slice(0, j),
      ...simplifyPair(a, rest[j]),
      ...rest.slice(j + 1),
    ];

    if (newGroup.length !== group.length) {
      return simplifyGroup(newGroup, d);
    }
    return simplifyGroup(newGroup, incrementDuration(d));
  }

  return groupTiedEvents(events_)
    .map((g) => simplifyGroup(g, Duration.ThirtySecond))
    .map((g) => {
      if (g.length === 0) {
        return [];
      }
      const tied = A.last(g).tiedToNext;
      const sorted = tieGroup(sortDescending(g));
      return [...A.first(sorted), { ...A.last(sorted), tiedToNext: tied }];
    })
    .flat();
}

/**
 * Tie the n-1 first events in the `group` together. \
 * The last element keeps its `tiedToNext` value. \
 * Do not tie pauses together.
 */
export function tieGroup(group: MusicalEvent[]) {
  const [b, ...a] = [...group].reverse();
  return [
    ...[b, ...a.map((e) => ({ ...e, tiedToNext: !isPause(e) }))],
  ].reverse();
}

/**
 * Take an event `e` and turn it into a series
 * of 32nd notes that are tied together. \
 * An event with notes C and E and quarter duration \
 * would become eight events with notes C and E and 32nd duration.
 */
export function expandTo32nds(e: MusicalEvent): MusicalEvent[] {
  return tieGroup(
    expandDuration(e.duration).map((_32nd) => ({
      ...e,
      duration: _32nd,
    }))
  );
}

/**
 * Sort `events` in the order [Whole, Half, ..., 32nd].
 */
function sortDescending(events: MusicalEvent[]): MusicalEvent[] {
  return [...events].sort((a, b) => {
    const durations = Object.values(Duration);
    const aIndex = durations.indexOf(a.duration);
    const bIndex = durations.indexOf(b.duration);
    return bIndex - aIndex;
  });
}

/**
 * Create a 2d array, where each array
 * contains events that are tied together.
 */
export function groupTiedEvents(events_: MusicalEvent[]): MusicalEvent[][] {
  function firstGroup(events: MusicalEvent[]): MusicalEvent[] {
    if (events.length < 2) {
      return [...events];
    }
    const [a, b, ...rest] = events;
    const shouldTie =
      A.arrayEquals(
        a.notes.map((n) => n.name),
        b.notes.map((n) => n.name)
      ) &&
      (a.tiedToNext || isPause(a));
    if (shouldTie) {
      return [a, ...firstGroup([b, ...rest])];
    }
    return [a];
  }

  if (events_.length === 0) {
    return [];
  }
  const group = firstGroup(events_);
  const rest = events_.slice(group.length);
  return [group, ...groupTiedEvents(rest)];
}

/**
 * Simplify a pair of events to have a greater duration,
 * if a greater duration exists. Two events can be
 * simplified if they have the same notes and the same duration,
 * and that duration is not a whole note, e.g:
 *
 *   ['8', '8'] -> ['4']
 *   ['w', 'w'] -> ['w', 'w']
 *   ['q', 'h'] -> ['q', 'h']
 */
export function simplifyPair(a: MusicalEvent, b: MusicalEvent): MusicalEvent[] {
  if (
    a.notes.length === b.notes.length &&
    A.zip(a.notes, b.notes).map((pair) => noteEquals(pair[0], pair[1])) &&
    a.duration !== Duration.Whole
  ) {
    return [{ ...b, duration: incrementDuration(b.duration) }];
  }
  return [a, b];
}

/**
 * Return a note one semi-tone lower than `note`.
 */
export function lowerNote(note: Note): Note {
  const i = pitches.indexOf(note.name);
  if (i === 0) {
    return { name: A.last(pitches), octave: note.octave - 1 };
  }
  return { name: pitches[i - 1], octave: note.octave };
}
