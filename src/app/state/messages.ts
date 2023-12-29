/**
 * Enum for the different types of messages that can be sent to the context.
 * 
 * SET_NOTE_LENGTH: Sets the length of the note. See NoteLength. \
 * TOGGLE_KEY: Toggles a piano key. See PianoKeys. \
 * COMMIT: Commits the current note or chord to the history. \
 * UNDO: Undoes the last note or chord in the history. \
 * REDO: Redoes the last note or chord undone in the history.
 */
export enum Message {
  SET_NOTE_LENGTH = "SET_NOTE_LENGTH",
  TOGGLE_PIANO_KEY = "TOGGLE_PIANO_KEY",
  // TOGGLE_PEDAL = "TOGGLE_PEDAL" 
  COMMIT = "COMMIT",
  CTRL_KEY_DOWN = "CTRL_KEY_DOWN",
  CTRL_KEY_UP = "CTRL_KEY_UP",
  UNDO = "UNDO",
  REDO = "REDO",
}
