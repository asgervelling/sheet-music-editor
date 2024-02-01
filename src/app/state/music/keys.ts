import { NoteName } from ".";
import { rotate } from "./arrays";
import { Note } from "./events";

export type ScaleStep = "1" | "b2" | "2" | "b3" | "3" | "4" | "b5" | "5" | "b6" | "6" | "b7" | "7";

export enum Accidental {
  Sharp = "#",
  Flat = "b",
  Natural = "",
}

/**
 * Get `note` as a step in the `key` major scale
 */
export function stepInKey(note: Note, key: NoteName): ScaleStep {
  const majorScale: ScaleStep[] = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"];
  const N = NoteName;
  const cMajor = [N.C, N.Db, N.D, N.Eb, N.E, N.F, N.Gb, N.G, N.Ab, N.A, N.Bb, N.B];

  const keyIndex = cMajor.indexOf(key);
  const keyNotes = rotate(cMajor, keyIndex);
  const noteIndex = keyNotes.indexOf(note.name);
  return majorScale[noteIndex];
}

export function interval(a: Note, b: Note): ScaleStep {
  throw new Error("Not implemented");
  // return stepInKey(b, a);
}

function isDiatonic(note: Note, key: NoteName): boolean {
  return stepInKey(note, key).includes("b");
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
