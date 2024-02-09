import { NoteName } from "../../music";
import { State } from "../state";

/**
 * Toggle a note in the state.activeNoteNames as being active or inactive.
 */
export default function toggleActiveNote(state: State, name: NoteName): State {
  // If the piano key is on, turn it off, and vice versa
  if (state.activeNoteNames.includes(name)) {
    return {
      ...state,
      activeNoteNames: [...state.activeNoteNames].filter((n) => n !== name),
    };
  } else {
    return {
      ...state,
      activeNoteNames: [...state.activeNoteNames, name],
    };
  }
}