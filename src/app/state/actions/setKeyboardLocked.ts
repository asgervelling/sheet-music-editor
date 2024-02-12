import { State } from "../state";

/**
 * Lock or unlock the keyboard, making the actions
 * `Message.KeyPress` and `Message.KeyRelease` do nothing.
 */
export default function setKeyboardLocked(state: State, value: boolean): State {
  return {
    ...state,
    keyboardLocked: value,
  };
}
