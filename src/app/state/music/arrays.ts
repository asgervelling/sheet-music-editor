/** Grab the first item of an array. */
export const head = <T>(l: T[]): T => l[0];

/** Return the last n-1 items of `l`, or `[]`. */
export const tail = <T>(l: T[]): T[] => l.slice(1);

/** Grab the last element of an array. */
export const last = <T>(l: T[]): T => l[l.length - 1];

/** Return the first n-1 items of `l`, or `[]`. */
export const first = <T>(l: T[]): T[] => l.slice(0, -1);

export const arrayEquals = <T>(l: T[], m: T[]): boolean => {
  return l.length === m.length && l.every((e, i) => e === m[i]);
};

/** Create an array of `n` `x`'s. */
export function repeat<T>(x: T, n: number): T[] {
  if (n <= 0 || isNaN(n)) return [];
  function createArray<T>(a: T[], n: number) {
    if (n === 1) return a;
    return createArray([...a, a[0]], n - 1);
  }

  return createArray([x], n);
}

/** Split `l` into chunks of sizes `chunkSizes`. */
export function chunk<T>(l: T[], chunkSizes: number[]): T[][] {
  if (chunkSizes.length === 0) return [];
  const n = head(chunkSizes);
  const [c, rest] = [l.slice(0, n), l.slice(n)];
  return [c, ...chunk(rest, tail(chunkSizes))];
}

/**
 * Rotate `l` `n` steps.
 * Use a negative `n` to rotate right.
 *
 *   `rotate([1, 2, 3, 4], 1)  -> [2, 3, 4, 1]` \
 *   `rotate([1, 2, 3, 4], -1) -> [4, 1, 2, 3]` \
 *   `rotate([1, 2, 3, 4], -5) -> [4, 1, 2, 3]`
 */
export function rotate<T>(l: T[], n: number): T[] {
  const m = n % l.length;
  return [...l.slice(m), ...l.slice(0, m)];
}

/**
 * Create an array of pairs from `l` like dominoes, e.g.
 *
 *   `pair([1, 2, 3]) = [[1, 2], [2, 3]]`
 *
 * If `l` has a length of 1, the first and only pair
 * will have a first element of `null`.
 */
export function pair<T>(l: T[]): [T | null, T][] {
  const n = l.length;
  if (n === 0) return [];
  if (n === 1) return [[null, head(l)]];
  if (n % 2 !== 0) {
    return [
      [head(l), head(tail(l))],
      ...first(tail(l)).map((t, i) => [t, tail(l)[i + 1]] as [T, T]),
    ];
  }
  return first(l).map((t, i) => [t, l[i + 1]]);
}
