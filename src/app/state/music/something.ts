// function permutations<T>(arr: T[]): T[][] {
//   if (arr.length === 1) {
//     return [arr];
//   }

//   return arr.reduce((acc: T[][], current, index) => {
//     const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];
//     const permutationsOfRest = permutations(rest);
//     const permutationsWithCurrent = permutationsOfRest.map((perm) => [current, ...perm]);
//     return [...acc, ...permutationsWithCurrent];
//   }, []);
// }

// // Example usage:
// const inputArray = [1, 2, 3];
// const result = permutations(inputArray);
// console.log(result);

const excluding =
  (i: number) =>
  <T>(xs: T[]): T[] =>
    [...xs.slice(0, i), ...xs.slice(i + 1)];

function permutations<T>(items: T[], size: number = items.length): T[][] {
  if (!size) {
    return [[]];
  }

  size = Math.min(items.length, size);

  return items.flatMap((item, i) => {
    return permutations(
      excluding(i)(items),
      size - 1
    ).map((permutation) => [item, ...permutation]);
  });
}

function arrayPermutations<T>(arrays: T[][]): T[][] {
  return arrays.reduce((acc: T[][], arr) => {
    const perms = permutations(arr);
    return acc.flatMap((accArr: T[]) => perms.map((perm) => accArr.concat(perm)));
  }, [[]]);
}

const inputArray = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const result = arrayPermutations(inputArray);
console.log(result);
