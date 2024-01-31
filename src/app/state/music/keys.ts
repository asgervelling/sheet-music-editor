import { Note } from ".";

/**
 * Get `note` as a step in the `key` major scale
 */
export function stepInKey(note: Note, key: Note) {
  const majorScale = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"];
  const N = Note;
  const cMajor = [N.C, N.Db, N.D, N.Eb, N.E, N.F, N.Gb, N.G, N.Ab, N.A, N.Bb, N.B];
  
  const keyIndex = cMajor.indexOf(key);

  // Rotate the major scale based on the key's index
  const rotatedScale = majorScale.slice(keyIndex).concat(majorScale.slice(0, keyIndex));

  
  // Find the note in the rotated scale
  const noteIndex = cMajor.indexOf(note);
  console.log(`keyIndex: ${keyIndex}\n`,
              `noteIndex: ${noteIndex}\n`,
              `rotatedScale: ${rotatedScale}\n`);
  return rotatedScale[noteIndex];
}