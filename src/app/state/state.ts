import { MusicalEvent, Duration, Note } from "./music_theory";

export type State = {
  currNoteLength: Duration;
  activeNotes: Note[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};
