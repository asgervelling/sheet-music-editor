import { Message } from "./messages";
import { NoteLength, NoteName } from "./music_theory";

/**
 * An action is a message that is sent to the reducer.
 * It is used in determining the next state.
 */
export type Action =
  | { type: Message.SET_NOTE_LENGTH; payload: { noteLength: NoteLength } }
  | { type: Message.TOGGLE_ACTIVE_NOTE; payload: { noteName: NoteName } }
  | { type: Message.COMMIT }
  | { type: Message.KEY_PRESS; payload: { key: string } }
  | { type: Message.KEY_RELEASE; payload: { key: string } }
  | { type: Message.UNDO }
  | { type: Message.REDO };