import { describe, it, expect } from "@jest/globals";
import { toStaveNote, createTies } from "./sheet_music";
import { Duration } from "./state/music/durations";
import { D, e, e16, e8, e8t, event } from "./state/music/test_helpers";
import { StaveNote } from "vexflow";
import { Note } from "./state/music";

describe("toStaveNote", () => {
  function assertNoteHas(note: StaveNote, keys: string[], duration: string) {
    expect(note.getKeys()).toEqual(keys);
    expect(note.getDuration()).toEqual(duration);
  }
  it("should create a stave note of the right format", () => {
    const staveNote = toStaveNote(e8);
    assertNoteHas(staveNote, ["E/4"], "8");
    assertNoteHas(toStaveNote(e16), ["E/4"], "16");
    assertNoteHas(toStaveNote(event([Note.B], D.Sixteenth)), ["B/4"], "16");
    assertNoteHas(toStaveNote(event([Note.Ab], D.ThirtySecond)), ["Ab/4"], "32");
    assertNoteHas(toStaveNote(event([Note.Gb], D.Whole)), ["Gb/4"], "w");
  });

  it("should not care about events being tied", () => {
    assertNoteHas(toStaveNote(e8t), ["E/4"], "8");
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
