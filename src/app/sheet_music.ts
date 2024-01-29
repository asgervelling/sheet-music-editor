/**
 * @fileoverview
 * This module contains the code for the sheet music display.
 * It uses the VexFlow library to render the sheet music.
 * It includes functions that map from our own types
 * to VexFlow types.
 */
import * as VF from "vexflow";

import { Bar, MusicalEvent, Note } from "./state/music";
import { head } from "./state/music/arrays";
import { fmtChunk } from "./state/music/test_helpers";

/**
 * Convert a Note to the note name format used by VexFlow.
 */
export function toVexFlowName(note: Note): string {
  const octave = "4";
  if (note === Note.PAUSE) {
    return `b/${octave}`;
  } else {
    const name = note.replace("♭", "b");
    return `${name}/${octave}`;
  }
}

/**
 * Convert a MusicalEvent to a VexFlow StaveNote.
 */
export function toStaveNote(e: MusicalEvent): VF.StaveNote {
  const keys = e.notes.map(toVexFlowName);
  const duration = e.notes.includes(Note.PAUSE) ? `${e.duration}r` : e.duration;
  const note = new VF.StaveNote({
    clef: "treble",
    keys: keys,
    duration: duration,
  });
  return note;
}

/**
 * Tie musical events together to signify
 * that they are one continuous sound.
 */
export function createTies(bar: Bar, staveNotes: VF.StaveNote[]): VF.StaveTie[] {
  const tiedIndices = bar.events
    .map((e, i) => (e.tiedToNext ? i : -1))
    .filter((i) => i !== -1);
  console.log("Events:", fmtChunk(bar.events));
  console.log("Tied indices:", tiedIndices);
  const x = tiedIndices.map(
    (i) =>
      new VF.StaveTie({
        first_note: i === 0 ? null : staveNotes[i],
        last_note: staveNotes[i + 1],
        first_indices: [0],
        last_indices: [0],
      })
  );
  console.log(
    "Ties:",
    JSON.stringify(
      x.map(
        (t) =>
          `(${t.getNotes().first_note?.keys}, ${t.getNotes().last_note?.keys}, ${t.getNotes().first_indices, t.getNotes().last_indices})`
      ),
      null,
      2
    )
  );
  console.log("Events:", fmtChunk(bar.events));
  return x;
  return Array.from(
    { length: staveNotes.length },
    (_, i) =>
      new VF.StaveTie({
        first_note: staveNotes[i],
        last_note: staveNotes[i + 1],
      })
  );
}
