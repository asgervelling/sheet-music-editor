import { MusicalEvent, Note, NoteName } from "../music_theory";
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
  if (noNotes) return [{ name: NoteName.PAUSE, length: state.currNoteLength }];
  else return createNotesFromNames(state);
}

/**
 * Create a sorted note array from the state's active notes.
 */
function createNotesFromNames(state: State): Note[] {
  const compareFn = (a: NoteName, b: NoteName) => {
    const noteNames = Object.values(NoteName);
    const aIndex = noteNames.indexOf(a);
    const bIndex = noteNames.indexOf(b);
    return aIndex - bIndex;
  }
  const notes = [...state.activeNotes].sort(compareFn).map((name) => ({
    name: name,
    length: state.currNoteLength,
  }));
  return notes;
}