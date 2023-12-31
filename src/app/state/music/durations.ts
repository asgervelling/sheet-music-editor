import { Duration } from ".";

export function toNumber(duration: Duration): number {
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
 * Convert a float to a duration.
 * If the float does not correspond to
 * a duration from the enum, an error is thrown.
 */
export function toDuration(float: number): Duration {
  switch (float) {
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
 */
export function simplifyDurations(durations_: Duration[]): Duration[] {
  if (durations_.length < 2) {
    // A single duration can't be simplified
    return durations_;
  }

  /**
   * Simplify an array of durations
   * where each duration is the same.
   */
  const simplify = (durations: Duration[]): Duration[] => {
    if (new Set(durations).size > 1) {
      throw new Error("All durations must be the same");
    }
    const n = durations.length;
    if (n === 0) {
      return [];
    }
    if (n === 1) {
      return durations;
    }
    const [a, b, ...rest] = durations;
    return [...simplifyPair(a, b), ...simplify(rest)];
  };

  const simplifyPair = (a: Duration, b: Duration): Duration[] => {
    if (a !== b) {
      throw new Error(
        "Inner function simplifyPair assumes that a and b are the same"
      );
    }

    const lowToHigh: Duration[] = Object.values(Duration).reverse();
    const i = lowToHigh.indexOf(a);
    if (i < lowToHigh.indexOf(Duration.Whole)) {
      // Simplify pair to a greater duration
      return [lowToHigh[i + 1]];
    } else {
      // Pair cannot be simplified as they are both whole notes
      return [a, b];
    }
  };

  // Create a sorted array of arrays
  // containing equal values, e.g. [[A, A], [B]]
  const groups = Object.values(Duration)
    .filter((d) => durations_.includes(d))
    .map((d) => durations_.filter((dur) => dur === d));

  const simplified = groups.flatMap(simplify);
  const isIrreducible = simplified.length === durations_.length;

  if (isIrreducible) {
    return simplified;
  }
  return simplifyDurations(simplified);
}
