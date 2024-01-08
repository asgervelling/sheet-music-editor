import { Duration } from ".";

export function toFraction(duration: Duration): number {
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

export function toDuration(fraction: number): Duration {
  switch (fraction) {
    case 1:
      return Duration.Whole;
    case 1 / 2:
      return Duration.Half;
    case 1 / 4:
      return Duration.Quarter;
    case 1 / 8:
      return Duration.Eighth;
    case 1 / 16:
      return Duration.Sixteenth;
    default:
      throw new Error("Invalid fraction");
  }
}

/**
 * Convert a duration to an array of sixteenths.
 */
export function toSixteenths(d: Duration): Duration[] {
  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(d);

  const f = toSixteenths;
  if (i > 0) {
    return [...f(lowToHigh[i - 1]), ...f(lowToHigh[i - 1])];
  } else {
    return [lowToHigh[i]];
  }
}

export function simplifyDurations(durations: Duration[]) {

}