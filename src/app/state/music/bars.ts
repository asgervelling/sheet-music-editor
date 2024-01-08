import { Bar, Duration, MusicalEvent, Note } from ".";
import { toFraction } from "./durations";

/**
 * A bar is valid if the sum of the durations
 * of its musical events is equal to the
 * time signature.
 */
export function validateBar(bar: Bar): boolean {
  const { timeSignature, events } = bar;
  const [beatsPerBar, beatLength] = parseTimeSignature(timeSignature);
  const totalBeats: number = events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toFraction(curr), 0);

  return totalBeats === beatsPerBar / beatLength;
}

/**
 * Parse the nominator and denominator
 * of a time signature.
 */
export function parseTimeSignature(sig: string): [number, number] {
  const [top, bottom] = sig.split("/");
  return [parseInt(top), parseInt(bottom)];
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
  const [beatsPerBar, beatLength] = parseTimeSignature(bar.timeSignature);
  const totalBeats = beatsPerBar / beatLength;
  const events = bar.events;
  const totalEventBeats = events
    .map((e) => e.duration)
    .reduce((acc, curr) => acc + toFraction(curr), 0);
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
