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
 * KEY_PRESSED: For holding down keys \
 * KEY_RELEASED: For releasing keys \
 * SET_NOTE_LENGTH: For setting the current note length
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case MessageType.KEY_PRESSED:
      return {
        ...state,
        pressedKeys: {
          ...state.pressedKeys,
          [action.payload.key!]: true,
        },
      };
    case MessageType.KEY_RELEASED:
      const { [action.payload.key!]: _, ...rest } = state.pressedKeys;
      return {
        ...state,
        pressedKeys: rest,
      };
    case MessageType.SET_NOTE_LENGTH:
      console.log("Current note length: ", action.payload.noteLength!);
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
