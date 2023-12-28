import { Key } from "ts-key-enum";

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
}

export enum NoteLength {
  Whole = 1,
  Half,
  Quarter,
  Eighth,
  Sixteenth,
  ThirtySecond,
}

export type Note = {
  name: NoteName;
  length: NoteLength;
};

// Temporary
export const NoteToKey: Record<NoteName, string> = {
  [NoteName.C]: 'a',
  [NoteName.Db]: 'w',
  [NoteName.D]: 's',
  [NoteName.Eb]: 'e',
  [NoteName.E]: 'd',
  [NoteName.F]: 'f',
  [NoteName.Gb]: 't',
  [NoteName.G]: 'g',
  [NoteName.Ab]: 'y',
  [NoteName.A]: 'h',
  [NoteName.Bb]: 'u',
  [NoteName.B]: 'j',
};

// Opposite of NoteToKey
export const KeyToNote: Record<string, NoteName> = Object.entries(NoteToKey).reduce((acc, [note, key]) => {
  acc[key] = note as NoteName;
  return acc;
}, {} as Record<string, NoteName>);