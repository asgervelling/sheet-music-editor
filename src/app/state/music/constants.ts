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
 * The length of a note.
 */
export enum Duration {
  Whole = "w",
  Half = "h",
  Quarter = "q",
  Eighth = "8",
  Sixteenth = "16",
  ThirtySecond = "32",
}

/**
 * Mapping from Note to keyboard key.
 */
export const NoteToKey: Record<Note, string> = {
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

/**
 * Mapping from keyboard key to Note.
 */
export const KeyToNote = flipRecord(NoteToKey);

/**
 * Mapping from Duration to keyboard key.
 */
export const DurationToKey: Record<Duration, string> = {
  [Duration.Whole]: "1",
  [Duration.Half]: "2",
  [Duration.Quarter]: "3",
  [Duration.Eighth]: "4",
  [Duration.Sixteenth]: "5",
  [Duration.ThirtySecond]: "6",
};

/**
 * Mapping from keyboard key to Duration.
 */
export const KeyToDuration = flipRecord(DurationToKey);

type ObjectKey = string | number | symbol;

function flipRecord<T extends ObjectKey, U extends ObjectKey>(
  record: Record<T, U>
): Record<U, T> {
  return Object.entries(record).reduce((acc, [key, value]) => {
    acc[value as U] = key as T;
    return acc;
  }, {} as Record<U, T>);
}
