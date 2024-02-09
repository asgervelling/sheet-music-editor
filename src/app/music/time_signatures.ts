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
export function validateTimeSignature(timeSig: TimeSignature): boolean {
  const [a, _] = timeSig;
  return a !== 0 && Number.isInteger(a);
}

export function beatValue(timeSig: TimeSignature): number {
  const [_, b] = timeSig;
  return parseInt(
    b
      .replace(Duration.Whole, "1")
      .replace(Duration.Half, "2")
      .replace(Duration.Quarter, "4")
  );
}

/**
 * Create an array of 32nd notes from a time signature.
 */
export function tsTo32nds(timeSig: TimeSignature): Duration.ThirtySecond[] {
  if (!validateTimeSignature(timeSig)) {
    throw new Error(`Invalid time signature: ${timeSig}`);
  }
  const [a, b] = timeSig;
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
export function canSimplify(timeSig: TimeSignature): boolean {
  const [a, b] = timeSig;
  return b !== Duration.Whole && a % 2 === 0;
}

/**
 * Simplify a time signature to irreducible form.
 */
export function simplifyTs(timeSig: TimeSignature): TimeSignature {
  const [a, b] = timeSig;
  if (!canSimplify(timeSig)) {
    return timeSig;
  }
  return simplifyTs([a / 2, incrementDuration(b)]);
}

export function tsToString(timeSig: TimeSignature): string {
  const [a, b] = timeSig;
  return `${a}/${b}`
    .replace(Duration.Whole, "1")
    .replace(Duration.Half, "2")
    .replace(Duration.Quarter, "4");
}
