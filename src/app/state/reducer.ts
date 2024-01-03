import { Action } from "./actions";
import { Message } from "./messages";
import { State } from "./state";
import setNoteLength from "./actions/setNoteLength";
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
    case Message.SET_NOTE_LENGTH:
      return setNoteLength(state, action.payload.duration);

    case Message.TOGGLE_ACTIVE_NOTE:
      return toggleActiveNote(state, action.payload.noteName);

    case Message.COMMIT:
      return commit(state);

    case Message.KEY_PRESS:
      return keyPress(state, action.payload.key);

    case Message.KEY_RELEASE:
      return keyRelease(state, action.payload.key);

    default:
      return state;
  }
}