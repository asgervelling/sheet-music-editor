/**
 * @fileoverview
 * This file contains the code for the sheet music display.
 * It uses the VexFlow library to render the sheet music.
 * It includes functions to convert the our own types
 * to VexFlow graphics.
 */
import { StaveNote } from "vexflow";

import { Note } from "./state/music_theory";

/**
 * Convert a note to a VexFlow StaveNote
 */
export function noteToStaveNote(note: Note) {
  return new StaveNote({
    clef: "treble",
    keys: [note.name],
    duration: note.length,
  });
}