import { describe, it, expect } from "@jest/globals";

import reducer from "./reducer";
import {
  setNoteLength,
  toggleActiveNote,
  commit,
  keyPress,
  keyRelease,
  Action,
} from "./actions";
import { State } from "./state";
import { NoteLength, NoteName } from "./music_theory";
import { Message } from "./messages";

function createState(): State {
  return {
    currNoteLength: NoteLength.Quarter,
    activeNotes: [],
    history: [],
    undoStack: [],
    keysBeingHeld: [],
  };
}

describe("Reducer Tests", () => {
  it("should handle SET_NOTE_LENGTH action", () => {
    const initialState = createState();
    const action: Action = {
      type: Message.SET_NOTE_LENGTH,
      payload: { noteLength: NoteLength.Eighth },
    };
    const s0 = reducer(initialState, action);

    expect(s0.currNoteLength).toBe(NoteLength.Eighth);
  });

  it("should handle TOGGLE_ACTIVE_NOTE action", () => {
    const initialState = createState();

    // Toggle on some notes
    const actions: Action[] = [
      { type: Message.TOGGLE_ACTIVE_NOTE, payload: { noteName: NoteName.Ab } },
      { type: Message.TOGGLE_ACTIVE_NOTE, payload: { noteName: NoteName.F } },
      { type: Message.TOGGLE_ACTIVE_NOTE, payload: { noteName: NoteName.Db } },
    ];
    const s0 = actions.reduce(reducer, initialState);
    expect(s0.activeNotes).toEqual([NoteName.Ab, NoteName.F, NoteName.Db]);

    // Toggle off a note
    const action: Action = {
      type: Message.TOGGLE_ACTIVE_NOTE,
      payload: { noteName: NoteName.F },
    };
    const s1 = reducer(s0, action);
    expect(s1.activeNotes).toEqual([NoteName.Ab, NoteName.Db]);
  });

  it("should handle COMMIT action", () => {
    // Create a state with some active notes
    const s0: State = {
      currNoteLength: NoteLength.Quarter,
      activeNotes: [NoteName.Ab, NoteName.F, NoteName.Db],
      history: [],
      undoStack: [[{ name: NoteName.C, length: NoteLength.Whole }]],
      keysBeingHeld: [],
    };

    const s1 = reducer(s0, { type: Message.COMMIT });
    expect(s1.activeNotes).toEqual([]);
    expect(s1.history).toEqual([
      [
        { name: NoteName.Db, length: NoteLength.Quarter },
        { name: NoteName.F, length: NoteLength.Quarter },
        { name: NoteName.Ab, length: NoteLength.Quarter },
      ],
    ]);
    expect(s1.undoStack).toEqual([]);
  });
});
