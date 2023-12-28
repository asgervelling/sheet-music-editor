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

/**
 * The length of a note,
 * from whole to sixteenth
 */
export enum NoteLength {
  Whole = "Whole",
  Half = "Half",
  Quarter = "Quarter",
  Eighth = "Eighth",
  Sixteenth = "Sixteenth",
}

/**
 * A note (or pause) with a length
 */
export type Note = {
  name: NoteName | "Pause";
  length: NoteLength;
};

/**
 * A single note, a chord or a pause
 */
export type MusicalEvent = Note[];

/**
 * Any note or chord that is entered on the piano
 * can be committed by pressing the Enter key.
 * It will be added to the end of the history.
 */
export const CommitKey = "Enter";

export const PianoKeys: Record<NoteName, string> = {
  [NoteName.C]: "a",
  [NoteName.Db]: "w",
  [NoteName.D]: "s",
  [NoteName.Eb]: "e",
  [NoteName.E]: "d",
  [NoteName.F]: "f",
  [NoteName.Gb]: "t",
  [NoteName.G]: "g",
  [NoteName.Ab]: "y",
  [NoteName.A]: "h",
  [NoteName.Bb]: "u",
  [NoteName.B]: "j",
};

export const NoteLengthKeys: Record<NoteLength, string> = {
  [NoteLength.Whole]: "1",
  [NoteLength.Half]: "2",
  [NoteLength.Quarter]: "3",
  [NoteLength.Eighth]: "4",
  [NoteLength.Sixteenth]: "5",
};

// Opposite of PianoKeys
export const KeyToNote: Record<string, NoteName> = Object.entries(
  PianoKeys
).reduce((acc, [note, key]) => {
  acc[key] = note as NoteName;
  return acc;
}, {} as Record<string, NoteName>);

export const KeyToNoteLength: Record<string, NoteLength> = Object.entries(
  NoteLengthKeys
).reduce((acc, [noteLength, key]) => {
  acc[key] = noteLength as NoteLength;
  return acc;
}, {} as Record<string, NoteLength>);