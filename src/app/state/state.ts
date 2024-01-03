import { MusicalEvent, Duration, Note } from "./music_theory";

export type State = {
  currDuration: Duration;
  activeNotes: Note[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};
