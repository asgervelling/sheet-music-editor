import { NoteName } from "../music_theory";
import { State } from "../state";

/**
 * Toggle a note in the state.activeNotes as being active or inactive.
 */
export default function toggleActiveNote(state: State, noteName: NoteName): State {
  // If the piano key is on, turn it off, and vice versa
  if (state.activeNotes.includes(noteName)) {
    // Remove the note from the active notes
    return {
      ...state,
      activeNotes: [...state.activeNotes].filter((n) => n !== noteName),
    };
  } else {
    // Add the note to the active notes
    return {
      ...state,
      activeNotes: [...state.activeNotes, noteName],
    };
  }
}