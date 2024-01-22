export const head = <T>(l: T[]) => l[0];
export const tail = <T>(l: T[]) => {
  if (l.length === 0) {
    return [];
  }
  return l.slice(1);
};
