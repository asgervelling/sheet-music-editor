import * as VF from "vexflow";

import { first, head, pair, rotate } from "./arrays";
import { MusicalEvent, Note, NoteName, lowerNote, pitches } from "./events";
import { staveNote } from "../../sheet_music";
import { fmtEvent } from "./test_helpers";

export type ScaleStep =
  | "1"
  | "b2"
  | "2"
  | "b3"
  | "3"
  | "4"
  | "b5"
  | "5"
  | "b6"
  | "6"
  | "b7"
  | "7";

const steps: ScaleStep[] = [
  "1",
  "b2",
  "2",
  "b3",
  "3",
  "4",
  "b5",
  "5",
  "b6",
  "6",
  "b7",
  "7",
];

export enum Accidental {
  Sharp = "#",
  Flat = "b",
  Natural = "",
}

/**
 * Get `note` as a step in the `key` major scale. Ex:
 *
 * - // C is the minor 3rd in the key of Eb \
 *   `stepInKey(NoteName.C, NoteName.Eb) === "b3"`
 */
export function stepInKey(noteName: NoteName, key: NoteName): ScaleStep {
  const N = NoteName;
  const cMajor = [
    N.C,
    N.Db,
    N.D,
    N.Eb,
    N.E,
    N.F,
    N.Gb,
    N.G,
    N.Ab,
    N.A,
    N.Bb,
    N.B,
  ];

  const keyIndex = cMajor.indexOf(key);
  const keyNotes = rotate(cMajor, keyIndex);
  const noteIndex = keyNotes.indexOf(noteName);
  return steps[noteIndex];
}

/**
 * Return the MIDI value of a note. \
 * The MIDI value is a number between 0 and 127. \
 * If the note falls outside that range, it will be clamped. \
 */
export function midiValue(note: Note): number {
  if (note.name === NoteName.PAUSE) {
    // Pauses still benefit from having a MIDI value.
    // We can use it to render a pause in a suitable position.
    const b4 = 71;
    return b4;
  }
  // MIDI defines the range [0..127] as valid pitch values.
  const i = Object.values(NoteName).indexOf(note.name);
  const value = note.octave * 12 + i + 12;
  return Math.max(0, Math.min(value, 127));
}

/**
 * Return the number of semitones `b` is higher than `a`. \
 * It may be negative.
 */
export function interval(a: Note, b: Note): number {
  return midiValue(b) - midiValue(a);
}

/**
 * True if `noteName` is diatonic in the given `key`. \
 * All the white notes are diatonic in the key of C.
 */
export function isDiatonic(noteName: NoteName, key: NoteName): boolean {
  if ([noteName, key].includes(NoteName.PAUSE)) return true;
  return !stepInKey(noteName, key).includes("b");
}

/**
 * True if `b` is a higher note than `a`
 */
export function isAscending(a: Note, b: Note): boolean {
  return midiValue(b) > midiValue(a);
}

/**
 * True if `b` is a lower note than `a`
 */
export function isDescending(a: Note, b: Note): boolean {
  return midiValue(b) < midiValue(a);
}

/**
 * Infer which accidental should be given to a the event notes \
 * based on the notes in the previous events and the key in which the user is playing.
 *
 * - The accidentals should be naturals \
 *   for all diatonic notes.
 *
 * - Non-diatonic notes should be flat (b), except when \
 *   the previous event has notes that are less than three semitones \
 *   below a given note and no notes that are less than three semitones \
 *   above the given note. In those cases, the accidentals should be sharp (#).
 */
export function inferAccidentals(
  event: MusicalEvent,
  previousEvent: MusicalEvent | null,
  key: NoteName
): Accidental[] {
  if (!previousEvent) {
    return event.notes.map((note) =>
      isDiatonic(note.name, key) ? Accidental.Natural : Accidental.Flat
    );
  }
  const n0 = previousEvent.notes;
  const n1 = event.notes;
  const x = n1.map((note) => {
    if (isDiatonic(note.name, key)) return Accidental.Natural;
    else if (
      n0.some((prev) => isDescending(prev, note) && interval(prev, note) > -3)
    ) {
      return Accidental.Flat;
    } else if (
      n0.some((prev) => isAscending(prev, note) && interval(prev, note) < 3)
    ) {
      return Accidental.Sharp;
    } else {
      return Accidental.Flat;
    }
  });
  return x;
}

export function applyAccidentals(
  events: MusicalEvent[],
  previous: MusicalEvent | null,
  key: NoteName
): VF.StaveNote[] {
  if (events.length === 0) return [];

  function createNote(
    e: MusicalEvent,
    previous: MusicalEvent | null
  ): VF.StaveNote {
    const withAccidental =
      (note: VF.StaveNote, ac: Accidental) => (i: number) =>
        note.addModifier(new VF.Accidental(ac), i);

    return inferAccidentals(e, previous, key).reduce(
      (acc, ac, i) => {
        switch (ac) {
          case Accidental.Natural:
            return acc;
          case Accidental.Flat:
            return {
              event: e,
              note: withAccidental(acc.note, ac)(i),
            };
          case Accidental.Sharp:
            const note = lowerNote(lowerNote(e.notes[i]));
            const notes = [
              ...e.notes.slice(0, i),
              note,
              ...e.notes.slice(i + 1),
            ];
            const event: MusicalEvent = { ...e, notes };
            return {
              event: event,
              note: withAccidental(acc.note, ac)(i),
            };
        }
      },
      {
        event: e,
        note: staveNote(e),
      }
    ).note;
  }

  return [createNote(head(events), previous)].concat(
    pair(events).map(([a, b]) => createNote(b, a))
  );
}
