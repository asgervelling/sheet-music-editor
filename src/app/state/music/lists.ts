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