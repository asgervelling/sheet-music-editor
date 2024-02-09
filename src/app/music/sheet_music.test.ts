import { describe, it, expect } from "@jest/globals";
import { D, e16, e8, e8t, event } from "./test_helpers";
import { StaveNote } from "vexflow";
import { NoteName } from ".";
import { staveNote } from "./sheet_music";

describe("staveNote", () => {
  function assertNoteHas(note: StaveNote, keys: string[], duration: string) {
    expect(note.getKeys()).toEqual(keys);
    expect(note.getDuration()).toEqual(duration);
  }
  it("should create a stave note of the right format", () => {
    assertNoteHas(staveNote(e8), ["e/4"], "8");
    assertNoteHas(staveNote(e16), ["e/4"], "16");
    assertNoteHas(staveNote(event([NoteName.B], D.Sixteenth)), ["b/4"], "16");
    assertNoteHas(
      staveNote(event([NoteName.Ab], D.ThirtySecond)),
      ["ab/4"],
      "32"
    );
    assertNoteHas(staveNote(event([NoteName.Gb], D.Whole)), ["gb/4"], "w");
  });

  it("should not care about events being tied", () => {
    assertNoteHas(staveNote(e8t), ["e/4"], "8");
  });
});

