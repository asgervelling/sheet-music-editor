import { Duration } from "./durations";

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
 * A single note or pause is a list of length 1.
 * A chord is a list of notes.
 */
export type MusicalEvent = {
  notes: Note[];
  duration: Duration;
};