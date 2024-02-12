"use client";
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

import { Duration } from "@/app/music";
import { State } from "./state";
import { Action } from "./actions";
import reducer from "./reducer";

const initialState: State = {
  currDuration: Duration.Quarter,
  currOctave: 4, // HARDCODED
  activeNoteNames: [],
  history: [],
  undoStack: [],
  keysBeingHeld: [],
  keyboardLocked: false,
};

/**
 * The state context value is an object that contains a
 * state and a function that can be used to dispatch
 * actions to the reducer to update state.
 */
type StateContextValue = {
  state: State;
  dispatch: Dispatch<Action>;
};

type StateContextProps = {
  children: ReactNode;
};

/**
 * The state context is a react context that provides
 * the state and dispatch function. \
 * You can access these objects with useContext(StateContext).
 */
const StateContext = createContext<StateContextValue | undefined>(undefined);

/**
 * The state provider is a react component that wraps our application.
 * It provides the state context to all child components,
 * even the ones that are nested deep in the component tree.
 */
const StateProvider: React.FC<StateContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, StateContext };
