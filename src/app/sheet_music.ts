/**
 * @fileoverview
 * This file contains the code for the sheet music display.
 * It uses the VexFlow library to render the sheet music.
 * It includes functions to convert the our own types
 * to VexFlow graphics.
 */
import { StaveNote } from "vexflow";

import { MusicalEvent, Note } from "./state/music_theory";

/**
 * Convert a Note to the note name format used by VexFlow.
 */
export function toVexFlowName(note: Note): string {
  const octave = "4";
  if (note === Note.PAUSE) {
    return `b/${octave}`;
  } 
  else {
    const name = note.replace("♭", "b");
    return `${name}/${octave}`;
  }
}

/**
 * Convert a MusicalEvent to a VexFlow StaveNote.
 */
export function toStaveNote(e: MusicalEvent): StaveNote {
  const keys = e.notes.map(toVexFlowName);
  const note = new StaveNote({
    clef: "treble",
    keys: keys,
    duration: e.duration,
  });
  return note;
}
