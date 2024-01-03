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
 * The length of a note,
 * from whole to sixteenth
 */
export enum Duration {
  Whole = "w",
  Half = "h",
  Quarter = "q",
  Eighth = "8",
  Sixteenth = "16",
}

/**
 * A note with a name and a length
 */
// export type Note = {
//   name: Note;
//   length: Duration;
// };

/**
 * A chord or a pause.
 * A single note or pause is a list of length 1.
 * A chord is a list of notes.
 */
export type MusicalEvent = {
  notes: Note[];
  duration: Duration;
}

/**
 * A bar is a list of musical events
 * with a time signature.
 * Use the time signature to validate the bar.
 */
export type Bar = {
  timeSignature: string;
  events: MusicalEvent[];
};

/**
 * Any note or chord that is entered on the piano
 * can be committed by pressing the Enter key.
 * It will be added to the end of the history.
 */
export const CommitKey = "Enter";

export const PianoKeys: Record<Note, string> = {
  [Note.C]: "a",
  [Note.Db]: "w",
  [Note.D]: "s",
  [Note.Eb]: "e",
  [Note.E]: "d",
  [Note.F]: "f",
  [Note.Gb]: "t",
  [Note.G]: "g",
  [Note.Ab]: "y",
  [Note.A]: "h",
  [Note.Bb]: "u",
  [Note.B]: "j",
  [Note.PAUSE]: "p",
};

export const NoteLengthKeys: Record<Duration, string> = {
  [Duration.Whole]: "1",
  [Duration.Half]: "2",
  [Duration.Quarter]: "3",
  [Duration.Eighth]: "4",
  [Duration.Sixteenth]: "5",
};

// Opposite of PianoKeys
export const KeyToNote: Record<string, Note> = Object.entries(
  PianoKeys
).reduce((acc, [note, key]) => {
  acc[key] = note as Note;
  return acc;
}, {} as Record<string, Note>);

export const KeyToNoteLength: Record<string, Duration> = Object.entries(
  NoteLengthKeys
).reduce((acc, [duration, key]) => {
  acc[key] = duration as Duration;
  return acc;
}, {} as Record<string, Duration>);