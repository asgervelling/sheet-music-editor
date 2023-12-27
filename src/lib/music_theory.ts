import { Key } from "ts-key-enum";

export enum NoteNames {
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
}

export enum NoteLength {
  Whole = 1,
  Half,
  Quarter,
  Eighth,
  Sixteenth,
}

export type Note = {
  name: NoteNames;
  length: NoteLength;
};

// Temporary
export const NoteToKey: Record<NoteNames, string> = {
  [NoteNames.C]: 'a',
  [NoteNames.Db]: 'w',
  [NoteNames.D]: 's',
  [NoteNames.Eb]: 'e',
  [NoteNames.E]: 'd',
  [NoteNames.F]: 'f',
  [NoteNames.Gb]: 't',
  [NoteNames.G]: 'g',
  [NoteNames.Ab]: 'y',
  [NoteNames.A]: 'h',
  [NoteNames.Bb]: 'u',
  [NoteNames.B]: 'j',
};