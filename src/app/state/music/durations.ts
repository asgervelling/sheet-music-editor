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

/**
 * Simplify an array of durations
 * to the shortest possible array of durations.
 *
 * [16th, 16th, 16th] -> [8th, 16th]
 */
export function simplifyDurations(durations_: Duration[]): Duration[] {
  /*
  Algorithm is:
  sort
  if can be simplified
  simplify
  recursive call
  else
  return
*/
  if (durations_.length < 2) {
    // A single duration can't be simplified
    return durations_;
  }

  // Create a sorted array of arrays
  // containing equal values, e.g. [[A, A], [B]]
  const groups = Object.values(Duration)
    .filter((d) => durations_.includes(d))
    .map((d) => durations_.filter((dur) => dur === d));

  console.log(durations_);
  console.log(groups);
  

  const simplify = (durations: Duration[]): Duration[] => {
    // Assume the array is sorted from short to long duration.
    // Fold and simplify the first durations,
    // that are the same.
    const shortestDurations = durations.filter((d) => d === durations[0]);
    const simplified = shortestDurations.reduce(simplifyPair);
    return [];
    // const changed: boolean

    // Implementation...
  };

  const simplifyPair = (a: Duration, b: Duration): Duration => {
    if (a !== b) {
      throw new Error(
        "Inner function simplifyPair assumes that a and b are the same"
      );
    }

    const lowToHigh: Duration[] = Object.values(Duration).reverse();
    const i = lowToHigh.indexOf(a);
    if (i < lowToHigh.indexOf(Duration.Whole)) {
      // Simplify pair to a greater duration
      return lowToHigh[i + 1];
    } else {
      // Pair cannot be simplified as they are both whole notes
      return a;
    }
  };
  return [];
}

simplifyDurations([
  Duration.Sixteenth,
  Duration.Sixteenth,
  Duration.Whole,
  Duration.Eighth,
  Duration.Whole,
  Duration.Half,
  Duration.Eighth,
  Duration.Eighth,
]);
