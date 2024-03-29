/**
 * The length of a note.
 */
export enum Duration {
  Whole = "w",
  Half = "h",
  Quarter = "q",
  Eighth = "8",
  Sixteenth = "16",
  ThirtySecond = "32",
}

/**
 * Convert a duration to an array of the shortest
 * duration we have.
 */
export function expandDuration(d: Duration): Duration.ThirtySecond[] {
  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(d);

  if (i > 0) {
    return [
      ...expandDuration(lowToHigh[i - 1]),
      ...expandDuration(lowToHigh[i - 1]),
    ];
  } else {
    return [Duration.ThirtySecond];
  }
}

/**
 * Return the duration larger than `a`, unless `a` is a whole note.
 */
export function incrementDuration(a: Duration): Duration {
  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(a);
  if (a !== Duration.Whole) {
    return lowToHigh[i + 1];
  } else {
    return a;
  }
}

export function asNumber(d: Duration): number {
  return 32 / expandDuration(d).length;
}
