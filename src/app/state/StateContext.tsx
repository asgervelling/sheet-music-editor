"use client";
import {
  MusicalEvent,
  NoteLength,
  PianoKeys,
} from "@/app/state/music_theory";
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { Message } from "./messages";
import { InputMode } from "./keyboard";

type State = {
  currNoteLength: NoteLength;
  activePianoKeys: Record<string, boolean>;
  inputMode: InputMode;
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
};

type Action =
  | { type: Message.SET_NOTE_LENGTH; payload: { noteLength: NoteLength } }
  | { type: Message.TOGGLE_PIANO_KEY; payload: { key: string } }
  | { type: Message.TOGGLE_INPUT_MODE }
  | { type: Message.COMMIT }
  | { type: Message.UNDO }
  | { type: Message.REDO };

const initialState: State = {
  currNoteLength: NoteLength.Quarter,
  activePianoKeys: initActivePianoKeys(),
  inputMode: InputMode.Notes,
  history: [],
  undoStack: [],
};

function initActivePianoKeys(): Record<string, boolean> {
  const activePianoKeys: Record<string, boolean> = {};
  Object.values(PianoKeys).forEach((key) => {
    activePianoKeys[key] = false;
  });
  return activePianoKeys;
}

/**
 * Reducer for the state.
 * Create a new state based on the previous
 * state and and an action.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Message.SET_NOTE_LENGTH:
      // Set the current note length
      console.log(Message.SET_NOTE_LENGTH, action.payload.noteLength!);
      return {
        ...state,
        currNoteLength: action.payload.noteLength!,
      };

    case Message.TOGGLE_PIANO_KEY:
      // If the piano key is on, turn it off, and vice versa
      const key = action.payload.key;
      const active = state.activePianoKeys[key];
      const newActivePianoKeys = { ...state.activePianoKeys, [key]: !active };
      return {
        ...state,
        activePianoKeys: newActivePianoKeys,
      };
    // const key = action.payload.key!;
    // const keyAlreadyHeld = state.heldPianoKeys[key] === true;

    // // Update state with the new key being held
    // if (!keyAlreadyHeld) {
    //   console.log(Message.PIANO_KEY_PRESSED, key);

    //   const noteName: NoteName = KeyToNote[key];
    //   const note: Note = { name: noteName, length: state.currNoteLength };

    //   return {
    //     ...state,
    //     heldPianoKeys: {
    //       ...state.heldPianoKeys,
    //       [key]: true,
    //     },
    //     history: [...state.history, note],
    //   };

    case Message.TOGGLE_INPUT_MODE:
      // Toggle between inputting notes and inputting pauses
      return {
        ...state,
        inputMode:
          state.inputMode === InputMode.Notes
            ? InputMode.Pauses
            : InputMode.Notes,
      };

    case Message.COMMIT:
      // Commit the current musical event to the history.
      // We don't distinguish between single notes, chords and pauses
      // as they are all events that can be drawn on the staff.
      console.log("Commit");

    case Message.UNDO:
      console.log("Undo");
    case Message.REDO:
      console.log("Redo");

    default:
      return state;
  }
};

/**
 * Create a musical event from the state.
 */
function createMusicalEvent(state: State): MusicalEvent {
  if (state.inputMode === InputMode.Pauses) {
    
  }
}

/**
 * Create a new state where the musical event
 * is added to the history.
 */
function commit(state: State, musicalEvent: MusicalEvent): State {
  return {
    ...state,
    history: [...state.history, musicalEvent],
  };
}

interface StateContextProps {
  children: ReactNode;
}

interface StateContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

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
