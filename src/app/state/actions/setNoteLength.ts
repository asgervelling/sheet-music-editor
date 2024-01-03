import { Duration } from "../music_theory";
import { State } from "../state";

/**
 * Set the state's current note length.
 */
export default function setNoteLength(state: State, duration: Duration): State {
  return {
    ...state,
    currNoteLength: duration,
  };
}