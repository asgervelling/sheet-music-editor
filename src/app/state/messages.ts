/**
 * Enum for the different types of messages that can be sent to the context.
 * 
 * SET_NOTE_LENGTH: Sets the length of the note. See NoteLength. \
 * TOGGLE_KEY: Toggles a piano key. See PianoKeys. \
 * TOGGLE_INPUT_MODE: Toggles the input mode between note (piano) and break (no piano). \
 * COMMIT: Commits the current note or chord to the history. \
 * UNDO: Undoes the last note or chord in the history. \
 * REDO: Redoes the last note or chord undone in the history.
 */
export enum Message {
  SET_NOTE_LENGTH = "SET_NOTE_LENGTH",
  TOGGLE_PIANO_KEY = "TOGGLE_PIANO_KEY",
  TOGGLE_INPUT_MODE = "TOGGLE_INPUT_MODE",
  // TOGGLE_PEDAL = "TOGGLE_PEDAL" // worry about this one later,
  COMMIT = "COMMIT",
  UNDO = "UNDO",
  REDO = "REDO",
}

/* 
SET_NOTE_LENGTH NoteLength.Whole ->
  s.currNoteLength = NoteLength.Whole

TOGGLE_PIANO_KEY "a" -> s.pianoNotes = ["a"]
TOGGLE_PIANO_KEY "g" -> s.pianoNotes = ["a", "g"]
TOGGLE_PIANO_KEY "a" -> s.pianoNotes = ["g"]
TOGGLE_PIANO_KEY "d" -> s.pianoNotes = ["g", "d"]
TOGGLE_PIANO_KEY "d" -> s.pianoNotes = ["g", "d", "a"]

COMMIT -> s.history = [
  [{ "G", Whole }, { "E", Whole }, { "C", Whole }],  // 1st chord
]
       -> s.toggleKeys = []      // reset piano

UNDO -> s.history = []
        s.redoStack = [
          [{ "G", Whole }, { "E", Whole }, { "C", Whole }]
        ]

TOGGLE_INPUT_MODE -> s.inputMode = InputMode.Pauses
COMMIT -> s.history = [ [{ "Break", Whole }] ]

TOGGLE_INPUT_MODE -> s.inputMode = InputMode.Notes
TOGGLE_PIANO_KEY "d" -> s.pianoNotes = ["d"]
COMMIT -> s.history = [ [{ "E", Whole }] ]
       -> s.pianoNotes = [] 
       
*/