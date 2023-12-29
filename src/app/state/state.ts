import { MusicalEvent, NoteLength, NoteName } from "./music_theory";

export type State = {
  currNoteLength: NoteLength;
  activeNotes: NoteName[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};
