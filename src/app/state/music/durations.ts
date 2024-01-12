import { Duration } from ".";
import { validateFraction, validateTimeSignature } from "./bars";
import { Fraction } from "./types";

export function isPowerOfTwo(n: number) {
  return n > 0 && (n & (n - 1)) === 0;
};

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
    case Duration.ThirtySecond:
      return 1 / 32;
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
    case 1 / 32:
      return Duration.ThirtySecond;
    default:
      throw new Error("Invalid float duration " + float);
  }
}

export function timeSignatureToDurations(ts: Fraction): Duration[] {
  const [a, b] = ts;
  if (!validateTimeSignature(ts)) {
    throw new Error("Invalid time signature " + ts);
  }
  const duration = 1 / b;
  const durations: Duration[] = [];
  for (let i = 0; i < a; i++) {
    durations.push(toDuration(duration));
  }
  return simplifyDurations(durations);
}

/**
 * Convert a duration to an array of the shortest
 * duration we have.
 */
export function expandDuration(d: Duration): Duration[] {
  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(d);

  const f = expandDuration;
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

  /**
   * Simplify a pair of durations
   * where each duration is the same,
   * such as [Quarter, Quarter] -> Half.
   */
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
