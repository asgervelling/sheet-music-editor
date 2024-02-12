import { Action, setKeyboardLocked } from "./actions";
import { Message } from "./messages";
import { State } from "./state";
import setDuration from "./actions/setDuration";
import toggleActiveNote from "./actions/toggleActiveNote";
import commit from "./actions/commit";
import keyPress from "./actions/keyPress";
import keyRelease from "./actions/keyRelease";

/**
 * Create a new state based on the previous
 * state and and an action.
 */
export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Message.SetDuration:
      return setDuration(state, action.payload.duration);

    case Message.ToggleActiveNote:
      return toggleActiveNote(state, action.payload.name);

    case Message.Commit:
      return commit(state);

    case Message.KeyPress:
      return keyPress(state, action.payload.key);

    case Message.KeyRelease:
      return keyRelease(state, action.payload.key);

    case Message.KeyboardLocked:
      return setKeyboardLocked(state, action.payload.value);
  }
}
