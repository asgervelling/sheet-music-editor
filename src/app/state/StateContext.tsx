"use client";
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

import { NoteLength } from "@/app/state/music_theory";
import { State } from "./state";
import { Action } from "./actions";
import reducer from "./reducer";

const initialState: State = {
  currNoteLength: NoteLength.Quarter,
  activeNotes: [],
  history: [],
  undoStack: [],
  keysBeingHeld: [],
};



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
