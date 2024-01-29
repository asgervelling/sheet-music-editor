import { Duration, expandDuration, incrementDuration } from "./durations";

/**
 * A musical time signature, such as 3/4,
 * can be expressed as [3, Duration.Quarter].
 */
export type TimeSignature = [number, Duration];

/**
 * A time signature is valid if
 * - it is a valid fraction and
 * - the denominator is a power of 2
 * - the numerator is not 0
 */
export function validateTimeSignature(ts: TimeSignature): boolean {
  const [a, _] = ts;
  return a !== 0 && Number.isInteger(a);
}

/**
 * Create an array of 32nd notes from a time signature.
 */
export function tsTo32nds(ts: TimeSignature): Duration.ThirtySecond[] {
  if (!validateTimeSignature(ts)) {
    throw new Error(`Invalid time signature: ${ts}`);
  }
  const [a, b] = ts;
  const bExpanded = expandDuration(b);
  return Array(a * bExpanded.length).fill(Duration.ThirtySecond);
}

/**
 * Create a time signature from an array of 32nd notes.
 */
export function _32ndsToTs(_32nds: Duration.ThirtySecond[]): TimeSignature {
  const n = _32nds.length;
  const b = _32nds[0];
  const a = n / expandDuration(b).length;

  return simplifyTs([a, b]);
}

/**
 * A time signature can be simplified if both
 * the numerator and denominator are even.
 */
export function canSimplify(ts: TimeSignature): boolean {
  const [a, b] = ts;
  return b !== Duration.Whole && a % 2 === 0;
}

/**
 * Simplify a time signature to irreducible form.
 */
export function simplifyTs(ts: TimeSignature): TimeSignature {
  const [a, b] = ts;
  if (!canSimplify(ts)) {
    return ts;
  }
  return simplifyTs([a / 2, incrementDuration(b)]);
}

export function tsToString(ts: TimeSignature): string {
  const [a, b] = ts;
  return `${a}/${b}`
    .replace(Duration.Whole, "1")
    .replace(Duration.Half, "2")
    .replace(Duration.Quarter, "4");
}
