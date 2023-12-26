export enum NoteNames {
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
}

export enum NoteLength {
  Whole = "Whole",
  Half = "Half",
  Quarter = "Quarter",
  Eighth = "Eighth",
  Sixteenth = "Sixteenth",
}

export type Note = {
  name: NoteNames;
  length: NoteLength;
};