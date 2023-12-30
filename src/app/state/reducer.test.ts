import test, { describe, it, expect } from '@jest/globals';

import reducer from './reducer';
import {
  setNoteLength,
  toggleActiveNote,
  commit,
  keyPress,
  keyRelease,
  Action,
} from './actions';
import { State } from './state';
import { NoteLength } from './music_theory';
import { Message } from './messages';

function createState(): State {
  return {
    currNoteLength: NoteLength.Quarter,
    activeNotes: [],
    history: [],
    undoStack: [],
    keysBeingHeld: [],
  };
}

describe('Reducer Tests', () => {
  it('should handle SET_NOTE_LENGTH action', () => {
    const initialState = createState();
    const action: Action = { type: Message.SET_NOTE_LENGTH, payload: { noteLength: NoteLength.Eighth } };
    const newState = reducer(initialState, action);

    expect(newState.currNoteLength).toBe(NoteLength.Eighth);
  });
});
