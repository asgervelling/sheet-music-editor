import { State } from "../state";

/**
 * Remove the released key from state.
 */
export default function keyRelease(state: State, key: string): State {
  return {
    ...state,
    keysBeingHeld: state.keysBeingHeld.filter((k) => k !== key),
  };
}