/**
 * Enum for the different types of messages
 * that can be given to the reducer.
 */
export enum Message {
  SET_NOTE_LENGTH = "SET_NOTE_LENGTH",
  TOGGLE_ACTIVE_NOTE = "TOGGLE_ACTIVE_NOTE",
  COMMIT = "COMMIT",
  KEY_PRESS = "KEY_PRESS",
  KEY_RELEASE = "KEY_RELEASE",
  UNDO = "UNDO",
  REDO = "REDO",
}
