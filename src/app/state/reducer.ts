import { Action } from "./actions";
import { Message } from "./messages";
import { MusicalEvent, Note, NoteLength, NoteName } from "./music_theory";
import { State } from "./state";

function setNoteLength(state: State, noteLength: NoteLength): State {
  return {
    ...state,
    currNoteLength: noteLength,
  };
}



/**
 * Reducer for the application state.
 * Create a new state based on the previous
 * state and and an action.
 */
export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Message.SET_NOTE_LENGTH:
      return setNoteLength(state, action.payload.noteLength);

    case Message.TOGGLE_ACTIVE_NOTE:
      // If the piano key is on, turn it off, and vice versa
      const noteName = action.payload.noteName;
      if (state.activeNotes.includes(noteName)) {
        // Remove the note from the active notes
        return {
          ...state,
          activeNotes: [...state.activeNotes].filter((n) => n !== noteName),
        };
      }
      // Add the note to the active notes
      return {
        ...state,
        activeNotes: [...state.activeNotes, noteName],
      };

    case Message.COMMIT:
      // Commit the current musical event to the history.
      // We don't distinguish between single notes, chords and pauses
      // as they are all events that can be drawn on the staff.
      const musicalEvent = createMusicalEvent(state);
      const s = commit(state, musicalEvent);
      return resetPianoKeys(s);

    case Message.KEY_PRESS:
      const pressedKey = action.payload.key;

      const ctrlKeyHeld = state.keysBeingHeld.includes("Control");
      const isUndo = pressedKey === "z" && ctrlKeyHeld;
      const isRedo = pressedKey === "x" && ctrlKeyHeld;

      const newState = {
        ...state,
        keysBeingHeld: [...state.keysBeingHeld, pressedKey],
      };
      if (isUndo) return undo(newState);
      if (isRedo) return redo(newState);
      return newState;

    case Message.KEY_RELEASE:
      const releasedKey = action.payload.key;
      return {
        ...state,
        keysBeingHeld: state.keysBeingHeld.filter((k) => k !== releasedKey),
      };

    default:
      return state;
  }
};

function undo(state: State): State {
  if (state.history.length === 0) {
    return state;
  }

  const lastEvent = state.history[state.history.length - 1];
  return {
    ...state,
    history: state.history.slice(0, state.history.length - 1),
    undoStack: [...state.undoStack, lastEvent],
  };
}

function redo(state: State): State {
  if (state.undoStack.length === 0) {
    return state;
  }

  const lastEvent = state.undoStack[state.undoStack.length - 1];
  return {
    ...state,
    history: [...state.history, lastEvent],
    undoStack: state.undoStack.slice(0, state.undoStack.length - 1),
  };
}

function createNotes(state: State): Note[] {
  return [...state.activeNotes].sort().map((name) => ({
    name: name,
    length: state.currNoteLength
  }));
}

/**
 * Create a musical event from the state's active notes
 */
function createMusicalEvent(state: State): MusicalEvent {
  const noNotes = state.activeNotes.length === 0;
  if (noNotes)
    return [{ name: NoteName.PAUSE, length: state.currNoteLength }];
  else
    return createNotes(state);
}

/**
 * Set the active notes to an empty array.
 */
function resetPianoKeys(state: State): State {
  return {
    ...state,
    activeNotes: [],
  };
}

/**
 * Create a new history from a history and a musical event.
 */
function updateHistory(
  history: MusicalEvent[],
  event: MusicalEvent
): MusicalEvent[] {
  if (event.length === 0) {
    return history;
  }
  return [...history, event];
}

/**
 * Create a new state where the musical event
 * is added to the history.
 */
function commit(state: State, musicalEvent: MusicalEvent): State {
  return {
    ...state,
    history: updateHistory(state.history, musicalEvent),
  };
}