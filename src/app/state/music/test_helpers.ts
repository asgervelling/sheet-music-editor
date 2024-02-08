import { Duration } from "./durations";
import { MusicalEvent } from "./events";
import { NoteName } from "./events";
import { repeat } from "./arrays";

export function event(names: NoteName[], duration: Duration): MusicalEvent {
  // HARDCODED octave
  return {
    notes: names.map((name) => ({ name: name, octave: 4 })),
    duration,
    tiedToNext: false,
  };
}

export function tiedToNext(e: MusicalEvent): MusicalEvent {
  return { ...e, tiedToNext: true };
}

export const c = (d: Duration) => event([NoteName.C], d);
export const e = (d: Duration) => event([NoteName.E], d);
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

export const db4 = event([NoteName.Db], D.Quarter);

export const p = (d: Duration) => event([NoteName.PAUSE], d);
export const p1 = p(D.Whole);
export const p2 = p(D.Half);
export const p4 = p(D.Quarter);
export const p8 = p(D.Eighth);
export const p16 = p(D.Sixteenth);
export const p32 = p(D.ThirtySecond);

export const c1t = tiedToNext(c1);
export const c2t = tiedToNext(c2);
export const c4t = tiedToNext(c4);
export const c8t = tiedToNext(c8);
export const c16t = tiedToNext(c16);
export const c32t = tiedToNext(c32);

export const e1t = tiedToNext(e1);
export const e2t = tiedToNext(e2);
export const e4t = tiedToNext(e4);
export const e8t = tiedToNext(e8);
export const e16t = tiedToNext(e16);
export const e32t = tiedToNext(e32);

export const p1t = tiedToNext(p1);
export const p2t = tiedToNext(p2);
export const p4t = tiedToNext(p4);
export const p8t = tiedToNext(p8);
export const p16t = tiedToNext(p16);
export const p32t = tiedToNext(p32);

export const _32nds = (n: number): Duration.ThirtySecond[] =>
  repeat(D.ThirtySecond, n);

export function fmtEvent(e: MusicalEvent) {
  const tiedStatus = e.tiedToNext ? "t" : "";
  return `([${e.notes.map((n) => n.name + "/" + n.octave).join(", ")}], ${
    e.duration
  }, ${tiedStatus})`;
}

export function fmtChunk(c: MusicalEvent[]) {
  return `[${c.map(fmtEvent).join(", ")}]`;
}

export function fmtChunks(chunks: MusicalEvent[][]) {
  return `[\n${chunks.map((c) => "  " + fmtChunk(c)).join(",\n")}\n]`;
}
