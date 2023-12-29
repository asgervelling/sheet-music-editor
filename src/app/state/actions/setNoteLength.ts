import { NoteLength } from "../music_theory";
import { State } from "../state";

/**
 * Set the state's current note length.
 */
export default function setNoteLength(state: State, noteLength: NoteLength): State {
  return {
    ...state,
    currNoteLength: noteLength,
  };
}