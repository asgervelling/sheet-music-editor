export const head = <T>(l: T[]) => l[0];
export const tail = <T>(l: T[]) => l.slice(1);

export const last = <T>(l: T[]) => l[l.length - 1];
export const first = <T>(l: T[]) => {
  return l.slice(0, -1);
};

export const arrayEquals = <T>(l: T[], m: T[]): boolean => {
  return l.length === m.length && l.every((e, i) => e === m[i]);
};

export function repeat<T>(x: T, n: number): T[] {
  if (n <= 0 || isNaN(n)) return [];
  function createArray<T>(a: T[], n: number) {
    if (n === 1) return a;
    return createArray([...a, a[0]], n - 1);
  }

  return createArray([x], n);
}

/**
 * Rotate `l` `n` steps.
 * Use a negative `n` to rotate right.
 *
 *   rotate([1, 2, 3, 4], 1) ->  [2, 3, 4, 1] \
 *   rotate([1, 2, 3, 4], -2) -> [3, 4, 1, 2] \
 *   rotate([1, 2, 3, 4], 6) ->  [3, 4, 1, 2]
 */
export function rotate<T>(l: T[], n: number): T[] {
  const m = n % l.length;
  return [...l.slice(m), ...l.slice(0, m)];
}

/**
 * Map over pairs of T's like dominoes, such as
 *
 *   [(1, 2), (2, 3)]
 *
 * for the array
 *
 *   [1, 2, 3]
 */
export function mapPairs<T, U>(list: T[], callback: (a: T, b: T) => U): U[] {
  return list.slice(0, -1).map((current, index) => {
    const next = list[index + 1];
    return callback(current, next);
  });
}
