import { Bar, Duration } from ".";

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

function toFraction(duration: Duration): number {
  switch (duration) {
    case Duration.Whole:
      return 1;
    case Duration.Half:
      return 1 / 2;
    case Duration.Quarter:
      return 1 / 4;
    case Duration.Eighth:
      return 1 / 8;
    case Duration.Sixteenth:
      return 1 / 16;
  }
}

/**
 * Parse the nominator and denominator
 * of a time signature.
 */
export function parseTimeSignature(sig: string): [number, number] {
  const [top, bottom] = sig.split("/");
  return [parseInt(top), parseInt(bottom)];
}
