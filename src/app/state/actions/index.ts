import { Message } from '../messages';
import { NoteLength, NoteName } from '../music_theory';

export { default as setNoteLength } from './setNoteLength';
export { default as toggleActiveNote } from './toggleActiveNote';
export { default as commit } from './commit';
export { default as keyPress } from './keyPress';
export { default as keyRelease } from './keyRelease';

/**
 * An action is a message that is sent to the reducer.
 * It is used in determining the next state.
 */
export type Action =
  | { type: Message.SET_NOTE_LENGTH; payload: { noteLength: NoteLength } }
  | { type: Message.TOGGLE_ACTIVE_NOTE; payload: { noteName: NoteName } }
  | { type: Message.COMMIT }
  | { type: Message.KEY_PRESS; payload: { key: string } }
  | { type: Message.KEY_RELEASE; payload: { key: string } };