import { describe, it, expect } from "@jest/globals";

import reducer from "./reducer";
import { Action } from "./actions";
import { State } from "./state";
import { Duration, NoteName, MusicalEvent } from "../music";
import { Message } from "./messages";
import { D, c4, db4, event } from "../music/test_helpers";

function createState(): State {
  return {
    currDuration: Duration.Quarter,
    currOctave: 4, // HARDCODED
    activeNoteNames: [],
    history: [],
    undoStack: [],
    keysBeingHeld: [],
  };
}

describe("Reducer Tests", () => {
  it("should handle SET_DURATION action", () => {
    const initialState = createState();
    const action: Action = {
      type: Message.SET_DURATION,
      payload: { duration: Duration.Eighth },
    };
    const s0 = reducer(initialState, action);

    expect(s0.currDuration).toBe(Duration.Eighth);
  });

  it("should handle TOGGLE_ACTIVE_NOTE_NAME action", () => {
    const initialState = createState();

    // Toggle on some notes
    const actions: Action[] = [
      { type: Message.TOGGLE_ACTIVE_NOTE_NAME, payload: { name: NoteName.Db } },
      { type: Message.TOGGLE_ACTIVE_NOTE_NAME, payload: { name: NoteName.F } },
      { type: Message.TOGGLE_ACTIVE_NOTE_NAME, payload: { name: NoteName.Ab } },
    ];
    const s0 = actions.reduce(reducer, initialState);
    expect(s0.activeNoteNames).toEqual([NoteName.Db, NoteName.F, NoteName.Ab]);

    // Toggle off a note
    const action: Action = {
      type: Message.TOGGLE_ACTIVE_NOTE_NAME,
      payload: { name: NoteName.F },
    };
    const s1 = reducer(s0, action);
    expect(s1.activeNoteNames).toEqual([NoteName.Db, NoteName.Ab]);
  });

  it("should handle COMMIT action", () => {
    // Create a state with some active notes and an undo stack
    const s0: State = {
      currDuration: Duration.Quarter,
      currOctave: 4, // HARDCODED
      activeNoteNames: [NoteName.Db, NoteName.F, NoteName.Ab],
      history: [c4],
      undoStack: [],
      keysBeingHeld: [],
    };

    // Committing a new MusicalEvent should clear the active notes,
    // add the new MusicalEvent to the end of the history,
    // and clear the undo stack
    const s1 = reducer(s0, { type: Message.COMMIT });
    expect(s1.activeNoteNames).toEqual([]);
    expect(s1.history).toEqual([c4, event([NoteName.Db, NoteName.F, NoteName.Ab], D.Quarter)]);
  });

  it("should handle KEY_PRESS action", () => {
    // Create a state with some active notes
    const s0: State = {
      currDuration: Duration.Quarter,
      currOctave: 4, // HARDCODED
      activeNoteNames: [NoteName.Db, NoteName.F, NoteName.Ab],
      history: [],
      undoStack: [],
      keysBeingHeld: [],
    };

    // Pressing a key should add it to the keysBeingHeld array
    const s1 = reducer(s0, { type: Message.KEY_PRESS, payload: { key: "a" } });
    expect(s1.keysBeingHeld).toEqual(["a"]);

    // Pressing a key that is already being held should not add it again
    const s2 = reducer(s1, { type: Message.KEY_PRESS, payload: { key: "a" } });
    expect(s2.keysBeingHeld).toEqual(["a"]);
  });

  it("should do an undo operation when the undo key combination is pressed", () => {
    // Create a state with some active notes and a history
    const initialHistory: MusicalEvent[] = [db4];
    const s0: State = {
      ...createState(),
      history: initialHistory,
    };

    // Pressing "z" while "Ctrl" is not held should not do anything
    const s1 = reducer(s0, { type: Message.KEY_PRESS, payload: { key: "z" } });
    expect(s1.history).toEqual(initialHistory);

    // Pressing "z" while "Ctrl" is held should undo the last MusicalEvent
    const keyCombination: Action[] = [
      { type: Message.KEY_PRESS, payload: { key: "Control" } },
      { type: Message.KEY_PRESS, payload: { key: "z" } },
    ];
    const s2 = keyCombination.reduce(reducer, s0);
    expect(s2.history).toEqual([]);
    expect(s2.undoStack).toEqual(initialHistory);

    // Undoing while there is no history should not do anything
    const s3 = reducer(createState(), {
      type: Message.KEY_PRESS,
      payload: { key: "z" },
    });
    expect(s3.history).toEqual([]);
  });

  it("should do a redo operation when the redo key combination is pressed", () => {
    /*
    Redo operation
    */
    const initialUndoStack: MusicalEvent[] = [db4];
    const s0: State = {
      ...createState(),
      undoStack: initialUndoStack,
    };

    // Pressing "x" while "Ctrl" is not held should not do anything
    const s1 = reducer(s0, { type: Message.KEY_PRESS, payload: { key: "x" } });
    expect(s1.undoStack).toEqual(initialUndoStack);

    // Pressing "x" while "Ctrl" is held should redo the last MusicalEvent,
    // popping it off the undo stack and pushing it onto the history
    const keyCombination: Action[] = [
      { type: Message.KEY_PRESS, payload: { key: "Control" } },
      { type: Message.KEY_PRESS, payload: { key: "x" } },
    ];

    const s2 = keyCombination.reduce(reducer, s0);
    expect(s2.undoStack).toEqual([]);
    expect(s2.history).toEqual(initialUndoStack);

    // Redoing while there is no undo stack should not do anything
    const s3 = keyCombination.reduce(reducer, createState());
    expect(s3.undoStack).toEqual([]);
  });

  it("should handle KEY_RELEASE action", () => {
    // Create a state with some active notes
    const s0: State = {
      currDuration: Duration.Quarter,
      currOctave: 4, // HARDCODED
      activeNoteNames: [NoteName.Db, NoteName.F, NoteName.Ab],
      history: [],
      undoStack: [],
      keysBeingHeld: ["a", "b", "c"],
    };

    // Releasing a key should remove it from the keysBeingHeld array
    const s1 = reducer(s0, {
      type: Message.KEY_RELEASE,
      payload: { key: "a" },
    });
    expect(s1.keysBeingHeld).toEqual(["b", "c"]);

    // Releasing a key that is not being held should not change the array
    const s2 = reducer(s1, {
      type: Message.KEY_RELEASE,
      payload: { key: "d" },
    });
    expect(s2.keysBeingHeld).toEqual(["b", "c"]);
  });
});
