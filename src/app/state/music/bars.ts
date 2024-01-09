import { Bar, Duration, MusicalEvent, Note } from ".";
import { toDuration, toNumber } from "./durations";
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

export function timeLeft(bar: Bar): Duration {
  const { timeSignature, events } = bar;
  const [beatsPerBar, beatLength] = timeSignature;
  const totalBeats: number = events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);
  const beatsLeft = beatsPerBar / beatLength - totalBeats;
  return toDuration(beatsLeft);
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
 * Create a full (valid) bar from the given events
 * and the time signature.
 */
export function toFullBar(bar: Bar): Bar {
  if (validateBar(bar)) {
    return bar;
  }
  console.log("Invalid bar, filling with pauses");
  const [beatsPerBar, beatLength] = bar.timeSignature;
  const totalBeats = beatsPerBar / beatLength;
  const events = bar.events;
  const totalEventBeats = events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toNumber(curr), 0);
  const missingBeats = totalBeats - totalEventBeats;
  const missingEvents = Math.floor(missingBeats / (1 / 16));
  const missingSixteenths = missingEvents * (1 / 16);
  const missingEvent: MusicalEvent = {
    notes: [Note.PAUSE],
    duration: Duration.Sixteenth,
  };
  const newEvents = [...events, ...Array(missingEvents).fill(missingEvent)];
  return { ...bar, events: newEvents };
}
