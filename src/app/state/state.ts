import { MusicalEvent, Duration, NoteName } from "../music";

export type State = {
  currDuration: Duration;
  currOctave: number;
  activeNoteNames: NoteName[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};
