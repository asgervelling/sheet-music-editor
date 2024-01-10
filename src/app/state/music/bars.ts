import { Bar, Duration, Note } from ".";
import { simplifyDurations, toNumber } from "./durations";
import { Fraction } from "./types";

/**
 * A bar is valid if the sum of the durations
 * of its musical events is equal to the
 * time signature.
 */
export function validateBar(bar: Bar): boolean {
  const { timeSignature, events } = bar;
  const [beatsPerBar, beatLength] = timeSignature;
  const totalBeats: number = events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);

  return totalBeats === beatsPerBar / beatLength;
}

/**
 * A time signature is valid if
 * - it is a valid fraction and
 * - the denominator is a power of 2
 * - the numerator is not 0
 */
export function validateTimeSignature(sig: Fraction): boolean {
  const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0;
  const [a, b] = sig;
  return validateFraction(sig) && isPowerOfTwo(b) && a !== 0;
}

/**
 * A fraction is valid if it is a tuple of two integers.
 * The denominator must not be 0.
 */
export function validateFraction(frac: Fraction): boolean {
  const [a, b] = frac;
  return b !== 0 && [a, b].every(Number.isInteger);
}

/**
 * Create a time signature from a string formatted
 * as "n/n".
 * If the formatting is wrong, an error is thrown.
 */
export function parseTimeSignature(sig: string): Fraction {
  const [top, bottom, ...rest] = sig.split("/");
  const [a, b] = [parseInt(top), parseInt(bottom)];

  if (!validateTimeSignature([a, b]) || rest.length > 0) {
    throw new Error(`Invalid time signature ${sig}.`);
  }

  return [a, b];
}

/**
 * Given a bar's timestamp and musical events,
 * find out how much time is yet to be used
 * in the bar, in terms of note durations.
 */
export function timeLeft(bar: Bar): Duration[] {
  const [a, b] = bar.timeSignature;
  const totalBeats: number = bar.events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);

  if (totalBeats >= a / b) {
    return [];
  }

  const beatsLeft = a / b - totalBeats;
  const sixteenthsLeft = beatsLeft / toNumber(Duration.Sixteenth);

  const sixteenths = Array(sixteenthsLeft).fill(Duration.Sixteenth);
  return simplifyDurations(sixteenths);
}

/**
 * Create a full (valid) bar from the given events
 * and the time signature.
 */
export function toFullBar(bar: Bar): Bar {
  const pause = (d: Duration) => ({ notes: [Note.PAUSE], duration: d });
  return {
    ...bar,
    events: [...bar.events, ...timeLeft(bar).map(pause)],
  };
}
