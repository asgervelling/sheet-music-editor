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
export function expand(d: Duration): Duration.ThirtySecond[] {
  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(d);

  if (i > 0) {
    return [...expand(lowToHigh[i - 1]), ...expand(lowToHigh[i - 1])];
  } else {
    return [Duration.ThirtySecond];
  }
}

/**
 * Simplify an array of durations
 * to the shortest possible array of durations.
 */
export function simplify(durations_: Duration[]): Duration[] {

  /**
   * Simplify an array of durations
   * where each duration is the same.
   */
  function inner(durations: Duration[]): Duration[] {
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
    return [...simplifyPair(a, b), ...inner(rest)];
  }

  // Create a sorted array of arrays
  // containing equal durations, e.g. [[4, 4], [8]]
  const groups = Object.values(Duration)
    .filter((d) => durations_.includes(d))
    .map((d) => durations_.filter((dur) => dur === d));

  const simplified = groups.flatMap(inner);
  const isIrreducible = simplified.length === durations_.length;

  if (isIrreducible) {
    return simplified;
  }
  return simplify(simplified);
}

/**
 * Simplify a pair of durations
 * where each duration is the same,
 * such as [Quarter, Quarter] -> [Half]. \
 * Whole notes can't be simplified: [W, W] -> [W, W].
 */
export function simplifyPair(a: Duration, b: Duration): Duration[] {
  if (a !== b) {
    throw new Error(
      "Inner function simplifyPair assumes that a and b are the same"
    );
  }

  const lowToHigh: Duration[] = Object.values(Duration).reverse();
  const i = lowToHigh.indexOf(a);
  if (a !== Duration.Whole) {
    // Simplify pair to a greater duration
    return [lowToHigh[i + 1]];
  } else {
    // Pair cannot be simplified as they are both whole notes
    return [a, b];
  }
}

/**
 * Return the duration larger than `a`, unless `a` is a whole note.
 */
export function incrementDuration(a: Duration): Duration {
  return simplifyPair(a, a)[0];
}

/**
 * Split an array of durations after the given length,
 * a list of durations.
 */
export function split(durations: Duration[], length: Duration[]): Duration[][] {
  const _32nds = (ds: Duration[]) => ds.flatMap(expand);
  const [fst, snd] = split32nds(_32nds(durations), _32nds(length));
  return [simplify(fst), simplify(snd)];
}

/**
 * Split an array of 32nd notes in two,
 * after `at`.
 */
export function split32nds(
  _32nds: Duration.ThirtySecond[],
  at: Duration.ThirtySecond[]
): [Duration.ThirtySecond[], Duration.ThirtySecond[]] {
  const n = at.length;
  return [_32nds.slice(0, n), _32nds.slice(n)];
}

/**
 * Get the number of 32nd notes an array of durations takes up.
 */
export function lengthIn32nds(durations: Duration[]): number {
  return durations.flatMap(expand).length;
}