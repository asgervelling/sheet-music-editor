/**
 * @fileoverview
 * This module contains the code for the sheet music display.
 * It uses the VexFlow library to render the sheet music.
 * It includes functions that map from our own types
 * to VexFlow types.
 */
import * as VF from "vexflow";

import { Bar, MusicalEvent, NoteName } from "./state/music";
import { Note } from "./state/music/events";
import { first, mapPairs } from "./state/music/arrays";
import { fmtChunk, fmtEvent } from "./state/music/test_helpers";
import { inferAccidental } from "./state/music/keys";

/**
 * Convert a NoteName to the note name format used by VexFlow.
 */
export function vexFlowName(note: Note): string {
  if (note.name === NoteName.PAUSE) {
    return `b/${note.octave}r`;
  } else {
    const name = note.name.replace("♭", "b");
    return `${name}/${note.octave}`;
  }
}

/**
 * Convert a MusicalEvent to a VexFlow StaveNote.
 */
export function staveNote(e: MusicalEvent): VF.StaveNote {
  const keys = e.notes.map(vexFlowName);
  const duration = e.duration;
  const note = new VF.StaveNote({
    clef: "treble",
    keys: keys,
    duration: duration,
  });
  return note;
}

// export function staveNotes(events: MusicalEvent[], key: NoteName): VF.StaveNote[] {
//   const l = [null, ...events]
//   mapPairs(l, (a, b): VF.StaveNote => {
//     if (b) {
//       const sNote = staveNote(b);
//       if (isDiatonic)
//     }
//   })
// }

/**
 * Tie musical events together to signify
 * that they are one continuous sound.
 */
export function createTies(
  bar: Bar,
  staveNotes: VF.StaveNote[]
): VF.StaveTie[] {
  const tiedIndices = bar.events
    .map((e, i) => (e.tiedToNext ? i : -1))
    .filter((i) => i !== -1);
  return tiedIndices.map(
    (i) =>
      new VF.StaveTie({
        first_note: staveNotes[i],
        last_note: staveNotes[i + 1],
        first_indices: [0],
        last_indices: [0],
      })
  );
}
