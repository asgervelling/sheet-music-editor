import { Bar, Duration, MusicalEvent, Note } from ".";
import { toNumber } from "./durations";
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
 * Create a time signature from a string formatted
 * as "n/n".
 * If the formatting is wrong, a warning is printed
 * and 4/4 is returned.
 */
export function parseTimeSignature(sig: string): Fraction {
  const [top, bottom] = sig.split("/");
  const [a, b] = [parseInt(top), parseInt(bottom)];
  if (isNaN(a) || isNaN(b)) {
    console.error(`Invalid time signature ${sig}. Returning 4/4`);
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
