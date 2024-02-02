import { rotate } from "./arrays";
import { Note, NoteName } from "./events";

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
export function toMIDIValue(note: Note): number {
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
 * Return the interval between `a` and `b` as a number of semitones.
 */
export function interval(a: Note, b: Note): number {
  return Math.abs(toMIDIValue(a) - toMIDIValue(b));
}

/**
 * True if `noteName` is diatonic in the given `key`. \
 * All the white notes are diatonic in the key of C.
 */
export function isDiatonic(noteName: NoteName, key: NoteName): boolean {
  if ([noteName, key].includes(NoteName.PAUSE)) return false;
  return !stepInKey(noteName, key).includes("b");
}

// /**
//  * For the moment, we only consider the sequence a, b
//  * to be ascending, if b is less than three semitones
//  *
//  */
// function isAscending(a: NoteName, b: NoteName): boolean {

// }

/**
 * Infer which accidental should be given to a note \
 * based on the previous note and the key in which the user is playing.
 *
 * - By default, the accidental should be Natural \
 *   if `note` is diatonic in `key`. \
 *   Otherwise, it will be Flat.
 *
 * - If `note` is played right after another note \
 *   with an interval less than or equal to three semitones, \
 *   the accidental will be sharp (#) when the sequence is ascending \
 *   and flat (b) when the sequence is descending.
 */
// export function inferAccidental(note: NoteName, previousNote: NoteName | null, key: NoteName): Accidental {

// }

// function isAscendingSequence(note: NoteName, previousNote: NoteName | null): boolean {

// }
