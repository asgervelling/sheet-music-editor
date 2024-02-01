import { MusicalEvent, Duration, NoteName } from "./music";

export type State = {
  currDuration: Duration;
  currOctave: 4; // HARDCODED
  activeNoteNames: NoteName[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};
