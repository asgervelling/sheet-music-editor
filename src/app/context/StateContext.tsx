"use client";
import { KeyToNote, Note, NoteLength, NoteName } from '@/lib/music_theory';
import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { MessageType } from './messages';

interface State {
  heldPianoKeys: Record<string, boolean>;
  currNoteLength: NoteLength;
  history: Note[];
}

interface Action {
  type: string;
  payload: {
    key?: string;
    noteLength?: NoteLength;
    history?: Note[];
  };
}

const initialState: State = {
  heldPianoKeys: {},
  currNoteLength: NoteLength.Quarter,
  history: [],
};

/**
 * Reducer for the state.
 * Create a new state based on the previous
 * state and and an action.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case MessageType.PIANO_KEY_PRESSED:
      const key = action.payload.key!;
      const keyAlreadyHeld = state.heldPianoKeys[key] === true;

      // Update state with the new key being held
      if (!keyAlreadyHeld) {
        console.log(MessageType.PIANO_KEY_PRESSED, key);
        
        const noteName: NoteName = KeyToNote[key];
        const note: Note = { name: noteName, length: state.currNoteLength };

        return {
          ...state,
          heldPianoKeys: {
            ...state.heldPianoKeys,
            [key]: true,
          },
          history: [...state.history, note],
        };
      }
      
      // If the key is already held, do nothing
      return state;

    case MessageType.PIANO_KEY_RELEASED:
      console.log(MessageType.PIANO_KEY_RELEASED, action.payload.key!);
      const { [action.payload.key!]: _, ...rest } = state.heldPianoKeys;
      return {
        ...state,
        heldPianoKeys: rest,
      };

    case MessageType.SET_NOTE_LENGTH:
      console.log(MessageType.SET_NOTE_LENGTH, action.payload.noteLength!);
      return {
        ...state,
        currNoteLength: action.payload.noteLength!,
      };

    default:
      return state;
  }
};


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
