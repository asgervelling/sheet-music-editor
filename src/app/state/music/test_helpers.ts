import { Duration, MusicalEvent, Note } from ".";

export function repeat<T>(x: T, n: number): T[] {
  function createArray<T>(a: T[], n: number) {
    if (n === 1) return a;
    return createArray([...a, a[0]], n - 1);
  }

  return createArray([x], n);
}

export function note(notes: Note[], duration: Duration): MusicalEvent {
  return { notes, duration, tiedToNext: false };
}

export function tiedToNext(e: MusicalEvent): MusicalEvent {
  return { ...e, tiedToNext: true };
}

export const c = (d: Duration) => note([Note.C], d);
export const e = (d: Duration) => note([Note.E], d);
export const D = Duration;

export const e1 = e(D.Whole);
export const e2 = e(D.Half);
export const e4 = e(D.Quarter);
export const e8 = e(D.Eighth);
export const e16 = e(D.Sixteenth);
export const e32 = e(D.ThirtySecond);
export const c1 = c(D.Whole);
export const c2 = c(D.Half);
export const c4 = c(D.Quarter);
export const c8 = c(D.Eighth);
export const c16 = c(D.Sixteenth);
export const c32 = c(D.ThirtySecond);

export const p = (d: Duration) => note([Note.PAUSE], d);
export const p1 = p(D.Whole);
export const p2 = p(D.Half);
export const p4 = p(D.Quarter);
export const p8 = p(D.Eighth);
export const p16 = p(D.Sixteenth);
export const p32 = p(D.ThirtySecond);

export const _32nds = (n: number): Duration.ThirtySecond[] =>
  repeat(D.ThirtySecond, n);

export function fmtEvent(e: MusicalEvent) {
  const tiedStatus = e.tiedToNext ? "t" : "";
  return `([${e.notes.join(", ")}], ${e.duration}, ${tiedStatus})`;
}

export function fmtChunk(c: MusicalEvent[]) {
  return `[${c.map(fmtEvent).join(", ")}]`;
}

export function fmtChunks(chunks: MusicalEvent[][]) {
  return `[\n${chunks.map((c) => "  " + fmtChunk(c)).join(",\n")}\n]`;
}
