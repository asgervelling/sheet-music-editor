"use client";
import { MusicalEvent, NoteLength, NoteName } from "@/app/state/music_theory";
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { Message } from "./messages";

type State = {
  currNoteLength: NoteLength;
  activeNotes: NoteName[];
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
  keysBeingHeld: string[];
};

const initialState: State = {
  currNoteLength: NoteLength.Quarter,
  activeNotes: [],
  history: [],
  undoStack: [],
  keysBeingHeld: [],
};

type ActionWithoutPayload = {
  type: Message;
};

type ActionWithPayload<P> = {
  type: Message;
  payload: P;
};

type SetNoteLengthAction = ActionWithPayload<NoteLength>;
type ToggleActiveNoteAction = ActionWithPayload<NoteName>;
type CommitAction = ActionWithoutPayload;
type KeyPressAction = ActionWithPayload<string>;
type KeyReleaseAction = ActionWithPayload<string>;

type Action =
  | SetNoteLengthAction
  | ToggleActiveNoteAction
  | CommitAction
  | KeyPressAction
  | KeyReleaseAction;

type Reducer = (state: State, action: Action) => State;

type Action2 =
  | { type: Message.SET_NOTE_LENGTH; payload: { noteLength: NoteLength } }
  | { type: Message.TOGGLE_ACTIVE_NOTE; payload: { noteName: NoteName } }
  | { type: Message.COMMIT }
  | { type: Message.KEY_PRESS; payload: { key: string } }
  | { type: Message.KEY_RELEASE; payload: { key: string } }
  | { type: Message.UNDO }
  | { type: Message.REDO };

/**
 * Reducer for the state.
 * Create a new state based on the previous
 * state and and an action.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Message.SET_NOTE_LENGTH:
      // Set the current note length
      return {
        ...state,
        currNoteLength: action.payload.noteLength!,
      };

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
      const isUndo =
        pressedKey === "z" && state.keysBeingHeld.includes("Control");
      const isRedo =
        pressedKey === "y" && state.keysBeingHeld.includes("Control");
      const newState = {
        ...state,
        keysBeingHeld: [...state.keysBeingHeld, pressedKey],
      };
      if (isUndo) {
        return undo(newState);
      }
      if (isRedo) {
        return redo(newState);
      }
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

/**
 * Create a musical event from the state.
 */
function createMusicalEvent(state: State): MusicalEvent {
  // Either a Pause
  if (state.activeNotes.length === 0) {
    return [{ name: NoteName.PAUSE, length: state.currNoteLength }];
  }

  // Or a Note[], which may be a single onte or a chord
  const compareFn = (a: NoteName, b: NoteName) => a.localeCompare(b);
  return Array.from(state.activeNotes)
    .sort(compareFn)
    .map((noteName) => ({
      name: noteName,
      length: state.currNoteLength,
    }));
}

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

type StateContextProps = {
  children: ReactNode;
};

type StateContextValue = {
  state: State;
  dispatch: Dispatch<Action>;
};

const StateContext = createContext<StateContextValue | undefined>(undefined);

const StateProvider: React.FC<StateContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, StateContext };
