export const head = <T>(l: T[]) => l[0];
export const tail = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(1);
};

export const last = <T>(l: T[]) => l[l.length - 1];
export const first = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(0, -1);
}

export const arrayEquals = <T>(l: T[], m: T[]): boolean => {
  return l.length === m.length && l.every((e, i) => e === m[i]);
}

export function repeat<T>(x: T, n: number): T[] {
  function createArray<T>(a: T[], n: number) {
    if (n === 1) return a;
    return createArray([...a, a[0]], n - 1);
  }

  return createArray([x], n);
}