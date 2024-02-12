import { Message } from "../messages";
import { Duration, NoteName } from "../../music";

export { default as setDuration } from "./setDuration";
export { default as toggleActiveNote } from "./toggleActiveNote";
export { default as commit } from "./commit";
export { default as keyPress } from "./keyPress";
export { default as keyRelease } from "./keyRelease";
export { default as setKeyboardLocked } from "./setKeyboardLocked";

/**
 * An action is a message that is sent to the reducer.
 * It is used in determining the next state.
 */
export type Action =
  | { type: Message.SetDuration; payload: { duration: Duration } }
  | { type: Message.ToggleActiveNote; payload: { name: NoteName } }
  | { type: Message.Commit }
  | { type: Message.KeyPress; payload: { key: string } }
  | { type: Message.KeyRelease; payload: { key: string } }
  | { type: Message.KeyboardLocked; payload: { value: boolean } };
