import { describe, it, expect } from "@jest/globals";

import {
  head,
  tail,
  first,
  last,
  arrayEquals,
  repeat,
  rotate,
  pair,
  takeAsLongAs,
} from "./arrays";

describe("head", () => {
  it("should return element 0 of a non-empty array", () => {
    expect(head([1])).toEqual(1);
    expect(head([1, 2])).toEqual(1);
  });

  it("should return undefined on an empty array", () => {
    expect(head([])).toEqual(undefined);
  });
});

describe("tail", () => {
  it("should return the last n-1 elements of a non-empty array", () => {
    expect(tail([1, 2])).toEqual([2]);
    expect(tail([1, 2, 3])).toEqual([2, 3]);
  });

  it("should return an empty array from an array of length 1", () => {
    expect(tail([1])).toEqual([]);
  });

  it("should return an empty array from an empty array", () => {
    expect(tail([])).toEqual([]);
  });
});

describe("last", () => {
  it("should return element n-1 of a non-empty array", () => {
    expect(last([1])).toEqual(1);
    expect(last([1, 2])).toEqual(2);
  });

  it("should return undefined on an empty array", () => {
    expect(last([])).toEqual(undefined);
  });
});

describe("first", () => {
  it("should return the first n-1 elements of a non-empty array", () => {
    expect(first([1, 2])).toEqual([1]);
    expect(first([1, 2, 3])).toEqual([1, 2]);
  });

  it("should return an empty array from an array of length 1", () => {
    expect(first([1])).toEqual([]);
  });

  it("should return an empty array from an empty array", () => {
    expect(first([])).toEqual([]);
  });
});

describe("arrayEquals", () => {
  it("should return true for two equal arrays", () => {
    expect(arrayEquals([1, 2, 3], [1, 2, 3])).toEqual(true);
  });

  it("should return false for two unequal arrays", () => {
    expect(arrayEquals([1, 2, 3], [1, 2, 4])).toEqual(false);
  });

  it("should return false for two arrays of different length", () => {
    expect(arrayEquals([1, 2, 3], [1, 2])).toEqual(false);
  });

  it("should return true for two empty arrays", () => {
    expect(arrayEquals([], [])).toEqual(true);
  });

  it("should return false for an empty array and a non-empty array", () => {
    expect(arrayEquals([], [1])).toEqual(false);
  });

  it("should return false for a non-empty array and an empty array", () => {
    expect(arrayEquals([1], [])).toEqual(false);
  });
});

describe("repeat", () => {
  it("should return an array of length n with each element equal to x", () => {
    expect(repeat(1, 3)).toEqual([1, 1, 1]);
    expect(repeat(1, 0)).toEqual([]);
  });

  it("should return an empty array when n is negative", () => {
    expect(repeat(1, -1)).toEqual([]);
  });

  it("should return an empty array when n is NaN", () => {
    expect(repeat(1, NaN)).toEqual([]);
  });
});

describe("rotate", () => {
  it("should rotate an array n steps clockwise when n is positive", () => {
    expect(rotate([1, 2, 3, 4], 1)).toEqual([2, 3, 4, 1]);
    expect(rotate([1, 2, 3, 4], 2)).toEqual([3, 4, 1, 2]);
    expect(rotate([1, 2, 3, 4], 0)).toEqual([1, 2, 3, 4]);
  });

  it("should rotate an array n steps counter-clockwise when n is negative", () => {
    expect(rotate([1, 2, 3, 4], -2)).toEqual([3, 4, 1, 2]);
    expect(rotate([1, 2, 3, 4], 0)).toEqual([1, 2, 3, 4]);
  });

  it("should not rotate when n is NaN", () => {
    expect(rotate([1, 2, 3, 4], NaN)).toEqual([1, 2, 3, 4]);
  });

  it("should rotate multiple rounds when n is greater than the length of the array", () => {
    expect(rotate([1, 2, 3, 4], 4)).toEqual([1, 2, 3, 4]);
    expect(rotate([1, 2, 3, 4], 5)).toEqual([2, 3, 4, 1]);
    expect(rotate([1, 2, 3, 4], -5)).toEqual([4, 1, 2, 3]);
    expect(rotate([1, 2, 3, 4], 8)).toEqual([1, 2, 3, 4]);
    expect(rotate(["a", "b", "c", "d", "e"], -2)).toEqual([
      "d",
      "e",
      "a",
      "b",
      "c",
    ]);
    expect(rotate(["a", "b", "c", "d", "e"], 4)).toEqual([
      "e",
      "a",
      "b",
      "c",
      "d",
    ]);
    expect(rotate([1, 2, 3, 4], -4)).toEqual([1, 2, 3, 4]);
    expect(rotate([1, 2, 3, 4], -5)).toEqual([4, 1, 2, 3]);
    expect(rotate([1, 2, 3, 4], -9)).toEqual([4, 1, 2, 3]);
  });
});

describe("pair", () => {
  it("should pair arrays of different lengths, including a null if uneven", () => {
    expect(pair([])).toEqual([]);
    expect(pair([1])).toEqual([[null, 1]]);
    expect(pair([1, 2])).toEqual([[1, 2]]);
    expect(pair([1, 2, 3])).toEqual([
      [1, 2],
      [2, 3],
    ]);
    expect(pair([1, 2, 3, 4])).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
    expect(pair([1, 2, 3, 4, 5])).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]);
  });
});

describe("takeAsLongAs", () => {
  it("should return elements until predicate returns false", () => {
    expect(takeAsLongAs([1, 2, 3, 4], (n) => n < 3)).toEqual([1, 2]);
  });

  it("should return an empty list if the first element does not pass", () => {
    expect(takeAsLongAs([1, 2, 3, 4], (n) => n > 4)).toEqual([]);
  });

  it("should take all elements if they all pass", () => {
    const l = ["a", "b", "c"];
    expect(takeAsLongAs(l, (s) => s.length === 1)).toEqual(l)
  })
});
