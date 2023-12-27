"use client";
import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

interface State {
  pressedKeys: Record<string, boolean>;
}

interface Action {
  type: string;
  payload: {
    key: string;
  };
}

const initialState: State = {
  pressedKeys: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'KEY_PRESSED':
      return {
        ...state,
        pressedKeys: {
          ...state.pressedKeys,
          [action.payload.key]: true,
        },
      };
    case 'KEY_RELEASED':
      const { [action.payload.key]: _, ...rest } = state.pressedKeys;
      return {
        ...state,
        pressedKeys: rest,
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
