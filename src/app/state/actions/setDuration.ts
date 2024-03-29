import { Duration } from "../../music";
import { State } from "../state";

/**
 * Set the state's current note length.
 */
export default function setDuration(state: State, duration: Duration): State {
  return {
    ...state,
    currDuration: duration,
  };
}