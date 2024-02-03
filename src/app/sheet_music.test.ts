import { describe, it, expect } from "@jest/globals";
import { staveNote, createTies, staveNotes } from "./sheet_music";
import { Duration } from "./state/music/durations";
import { D, c16t, c32, e, e16, e4t, e8, e8t, event } from "./state/music/test_helpers";
import { StaveNote } from "vexflow";
import { NoteName } from "./state/music";

describe("staveNote", () => {
  function assertNoteHas(note: StaveNote, keys: string[], duration: string) {
    expect(note.getKeys()).toEqual(keys);
    expect(note.getDuration()).toEqual(duration);
  }
  it("should create a stave note of the right format", () => {
    assertNoteHas(staveNote(e8), ["E/4"], "8");
    assertNoteHas(staveNote(e16), ["E/4"], "16");
    assertNoteHas(staveNote(event([NoteName.B], D.Sixteenth)), ["B/4"], "16");
    assertNoteHas(
      staveNote(event([NoteName.Ab], D.ThirtySecond)),
      ["Ab/4"],
      "32"
    );
    assertNoteHas(staveNote(event([NoteName.Gb], D.Whole)), ["Gb/4"], "w");
  });

  it("should not care about events being tied", () => {
    assertNoteHas(staveNote(e8t), ["E/4"], "8");
  });
});

describe.only("", () => {
  it("", () => {
    staveNotes([e4t, e8, c16t, c16t, c32]);
  });
});
