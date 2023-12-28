"use client";
import { NoteLength } from '@/lib/music_theory';
import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { MessageType } from './messages';

interface State {
  pressedKeys: Record<string, boolean>;
  currNoteLength: NoteLength;
}

interface Action {
  type: string;
  payload: {
    key?: string;
    noteLength?: NoteLength;
  };
}

const initialState: State = {
  pressedKeys: {},
  currNoteLength: NoteLength.Quarter,
};

/**
 * Reducer for the state.
 * Create a new state based on the action type
 * and payload, as well as the previous state.
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case MessageType.PIANO_KEY_PRESSED:
      console.log(MessageType.PIANO_KEY_PRESSED, action.payload.key!);
      return {
        ...state,
        pressedKeys: {
          ...state.pressedKeys,
          [action.payload.key!]: true,
        },
      };
    case MessageType.PIANO_KEY_RELEASED:
      console.log(MessageType.PIANO_KEY_RELEASED, action.payload.key!);
      const { [action.payload.key!]: _, ...rest } = state.pressedKeys;
      return {
        ...state,
        pressedKeys: rest,
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
