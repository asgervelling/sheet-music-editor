"use client";
import {
  MusicalEvent,
  Note,
  NoteLength,
  NoteName,
  PianoKeys,
} from "@/app/state/music_theory";
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { Message } from "./messages";

type State = {
  currNoteLength: NoteLength;
  activeNotes: Note[]
  history: MusicalEvent[];
  undoStack: MusicalEvent[];
};

type Action =
  | { type: Message.SET_NOTE_LENGTH; payload: { noteLength: NoteLength } }
  | { type: Message.TOGGLE_PIANO_KEY; payload: { noteName: NoteName } }
  | { type: Message.COMMIT }
  | { type: Message.UNDO }
  | { type: Message.REDO };

const initialState: State = {
  currNoteLength: NoteLength.Quarter,
  activeNotes: [],
  history: [],
  undoStack: [],
};

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
      const noteName = action.payload.noteName;
      const active = noteName in state.activeNotes;
      let activeNotes = [...state.activeNotes];
      if (active) {
        activeNotes = activeNotes.filter((note) => note.name !== noteName);
      } else {
        activeNotes.push({ name: noteName, length: state.currNoteLength });
      }
      return {
        ...state,
        activeNotes: activeNotes,
      };

    case Message.COMMIT:
      // Commit the current musical event to the history.
      // We don't distinguish between single notes, chords and pauses
      // as they are all events that can be drawn on the staff.
      const musicalEvent = createMusicalEvent(state);
      const s = commit(state, musicalEvent);
      return resetPianoKeys(s);

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
  // Either a Pause
  if (state.activeNotes.length === 0) {
    return [{ name: NoteName.PAUSE, length: state.currNoteLength }];
  }

  // Or a Note[], which may be a single onte or a chord
  return [...state.activeNotes];
  // return state.activeNotes.map(([key, _]) => ({
  //   name: key as NoteName,
  //   length: state.currNoteLength,
  // }));
}

function resetPianoKeys(state: State): State {
  return {
    ...state,
    activeNotes: [],
  };
}

/**
 * Create a new state where the musical event
 * is added to the history.
 */
function commit(state: State, musicalEvent: MusicalEvent): State {
  // Also reset keys
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
