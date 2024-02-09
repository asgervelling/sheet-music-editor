import { rotate } from "./arrays";
import { Note, NoteName } from "./notes";

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
