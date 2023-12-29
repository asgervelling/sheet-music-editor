/**
 * Enum for the different types of messages
 * that can be given to the reducer.
 */
export enum Message {
  SET_NOTE_LENGTH = "SET_NOTE_LENGTH",
  TOGGLE_PIANO_KEY = "TOGGLE_PIANO_KEY",
  COMMIT = "COMMIT",
  UNDO = "UNDO",
  REDO = "REDO",
}
