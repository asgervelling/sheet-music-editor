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
 * Mapping from NoteName to keyboard key.
 */
export const NoteToKey: Record<NoteName, string> = {
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
  [NoteName.PAUSE]: "p",
};

/**
 * Mapping from keyboard key to NoteName.
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
