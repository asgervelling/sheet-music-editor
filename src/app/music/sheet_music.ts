/**
 * @fileoverview
 * This module contains the code for the sheet music display.
 * It uses the VexFlow library to render the sheet music.
 * It includes functions that map from our own types
 * to VexFlow types.
 */
import * as VF from "vexflow";

import { Bar, MusicalEvent, NoteName } from ".";
import { isPause } from "./events";
import { Note } from "./notes";

/**
 * Convert a NoteName to the note name format used by VexFlow.
 */
export function vexFlowName(note: Note): string {
  if (note.name === NoteName.PAUSE) {
    return `b/${note.octave}`;
  } else {
    const name = note.name.replace("♭", "b").toLowerCase();
    return `${name}/${note.octave}`;
  }
}

/**
 * Convert a MusicalEvent to a VexFlow StaveNote.
 */
export function staveNote(e: MusicalEvent): VF.StaveNote {
  return new VF.StaveNote({
    clef: "treble",
    keys: e.notes.map(vexFlowName),
    duration: isPause(e) ? `${e.duration}r` : e.duration,
  });
}

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
  return tiedIndices.map((i) => {
    return new VF.StaveTie({
      first_note: staveNotes[i],
      last_note: staveNotes[i + 1],
      first_indices: [0],
      last_indices: [0],
    });
  });
}
