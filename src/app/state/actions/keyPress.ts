import { State } from "../state";

/**
 * Add the pressed key to state and potentially
 * do an undo or redo operation.
 */
export default function keyPress(state: State, key: string): State {
  const newState = addPressedKey(state, key);

  const ctrlKeyHeld = state.keysBeingHeld.includes("Control");
  const isUndo = key === "z" && ctrlKeyHeld;
  const isRedo = key === "x" && ctrlKeyHeld;

  if (isUndo) return undo(newState);
  if (isRedo) return redo(newState);
  return newState;
}

/**
 * Add the pressed key to the state.
 */
function addPressedKey(state: State, key: string): State {
  if (state.keysBeingHeld.includes(key)) {
    return state;
  }
  return {
    ...state,
    keysBeingHeld: [...state.keysBeingHeld, key],
  };
}

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