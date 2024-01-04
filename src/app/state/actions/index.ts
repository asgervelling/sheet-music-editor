import { Message } from "../messages";
import { Duration, Note } from "../music";

export { default as setDuration } from "./setDuration";
export { default as toggleActiveNote } from "./toggleActiveNote";
export { default as commit } from "./commit";
export { default as keyPress } from "./keyPress";
export { default as keyRelease } from "./keyRelease";

/**
 * An action is a message that is sent to the reducer.
 * It is used in determining the next state.
 */
export type Action =
  | { type: Message.SET_DURATION; payload: { duration: Duration } }
  | { type: Message.TOGGLE_ACTIVE_NOTE; payload: { note: Note } }
  | { type: Message.COMMIT }
  | { type: Message.KEY_PRESS; payload: { key: string } }
  | { type: Message.KEY_RELEASE; payload: { key: string } };
