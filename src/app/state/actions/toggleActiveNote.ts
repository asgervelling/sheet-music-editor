import { Note } from "../music";
import { State } from "../state";

/**
 * Toggle a note in the state.activeNotes as being active or inactive.
 */
export default function toggleActiveNote(state: State, duration: Note): State {
  // If the piano key is on, turn it off, and vice versa
  if (state.activeNotes.includes(duration)) {
    return {
      ...state,
      activeNotes: [...state.activeNotes].filter((n) => n !== duration),
    };
  } else {
    return {
      ...state,
      activeNotes: [...state.activeNotes, duration],
    };
  }
}