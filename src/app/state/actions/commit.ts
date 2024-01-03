import { MusicalEvent, Note } from "../music_theory";
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
    activeNotes: [],
    undoStack: [],
    history: [...state.history, event],
  };
}

/**
 * Create a musical event from the state's active notes
 */
function createMusicalEvent(state: State): MusicalEvent {
  const noNotes = state.activeNotes.length === 0;
  if (noNotes) return { notes: [Note.PAUSE], duration: state.currDuration };
  else return createNotesFromNames(state);
}

/**
 * Create a sorted note array from the state's active notes.
 */
function createNotesFromNames(state: State): MusicalEvent {
  const compareFn = (a: Note, b: Note) => {
    const durations = Object.values(Note);
    const aIndex = durations.indexOf(a);
    const bIndex = durations.indexOf(b);
    return aIndex - bIndex;
  }
  return {
    notes: [...state.activeNotes].sort(compareFn),
    duration: state.currDuration,
  };
}