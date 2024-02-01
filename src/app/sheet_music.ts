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

/**
 * Convert a NoteName to the note name format used by VexFlow.
 */
export function toVexFlowName(note: Note): string {
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
export function toStaveNote(e: MusicalEvent): VF.StaveNote {
  const keys = e.notes.map(toVexFlowName);
  const duration = e.duration;
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
