import { describe, it, expect } from "@jest/globals";
import { staveNote, createTies } from "./sheet_music";
import { Duration } from "./state/music/durations";
import { D, e, e16, e8, e8t, event } from "./state/music/test_helpers";
import { StaveNote } from "vexflow";
import { NoteName } from "./state/music";

describe("staveNote", () => {
  function assertNoteHas(note: StaveNote, keys: string[], duration: string) {
    expect(note.getKeys()).toEqual(keys);
    expect(note.getDuration()).toEqual(duration);
  }
  it("should create a stave note of the right format", () => {
    const staveNote = staveNote(e8);
    assertNoteHas(staveNote, ["E/4"], "8");
    assertNoteHas(staveNote(e16), ["E/4"], "16");
    assertNoteHas(staveNote(event([NoteName.B], D.Sixteenth)), ["B/4"], "16");
    assertNoteHas(staveNote(event([NoteName.Ab], D.ThirtySecond)), ["Ab/4"], "32");
    assertNoteHas(staveNote(event([NoteName.Gb], D.Whole)), ["Gb/4"], "w");
  });

  it("should not care about events being tied", () => {
    assertNoteHas(staveNote(e8t), ["E/4"], "8");
  });
});

// describe("createTies", () => {
//   it("should tie two notes inside a bar together", () => {
//     expect(createTies({
//       ts: [4, Duration.Quarter],
//       events: [e]
//     }))
//   })
// })
