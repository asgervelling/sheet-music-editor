import { MusicalEvent, NoteName } from "../../music";
import { State } from "../state";

/**
 * Create a new state where the musical event
 * is added to the history.
 * Reset the active notes and the undo stack.
 */
export default function commit(state: State): State {
  const event = createMusicalEvent(state);
  return {
    ...state,
    activeNoteNames: [],
    undoStack: [],
    history: [...state.history, event],
  };
}

/**
 * Create a musical event from the state's active notes
 */
function createMusicalEvent(state: State): MusicalEvent {
  const noNotes = state.activeNoteNames.length === 0;
  if (noNotes)
    return {
      notes: [{ name: NoteName.PAUSE, octave: state.currOctave }],
      duration: state.currDuration,
      tiedToNext: false,
    };
  else return createNotesFromNames(state);
}

/**
 * Create a sorted note array from the state's active notes.
 */
function createNotesFromNames(state: State): MusicalEvent {
  const compareFn = (a: NoteName, b: NoteName) => {
    const notes = Object.values(NoteName);
    const aIndex = notes.indexOf(a);
    const bIndex = notes.indexOf(b);
    return aIndex - bIndex;
  };
  return {
    notes: [...state.activeNoteNames]
      .sort(compareFn)
      .map((n) => ({ name: n, octave: state.currOctave })),
    duration: state.currDuration,
    tiedToNext: false,
  };
}
