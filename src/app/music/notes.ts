/**
 * All the pitch classes C, Db, ..., B as well as PAUSE.
 */
export enum NoteName {
  C = "C",
  Db = "Db",
  D = "D",
  Eb = "Eb",
  E = "E",
  F = "F",
  Gb = "Gb",
  G = "G",
  Ab = "Ab",
  A = "A",
  Bb = "Bb",
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
 * A note is the name of the note (or pause) and an octave.
 */
export type Note = {
  name: NoteName;
  octave: number;
};
