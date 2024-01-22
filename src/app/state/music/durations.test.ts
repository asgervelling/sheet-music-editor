import { describe, it, expect } from "@jest/globals";

import { Duration, expand, simplify, split, split32nds } from "./durations";
import { tsTo32nds } from "./time_signatures";
import {
  e2,
  e4,
  e8,
  e16,
  e32,
  c1,
  c2,
  c4,
  c8,
  c16,
  c32,
  p,
  p1,
  p2,
  p4,
  p8,
  p16,
  p32,
  repeat,
  D,
  _32nds,
} from "./test_helpers";

describe("expand", () => {
  it("should convert a duration to an array of sixteenths", () => {
    expect(expand(D.Whole)).toEqual(
      Array(32).fill(D.ThirtySecond)
    );
    expect(expand(D.Half)).toEqual(
      Array(16).fill(D.ThirtySecond)
    );
    expect(expand(D.Quarter)).toEqual(
      Array(8).fill(D.ThirtySecond)
    );
    expect(expand(D.Eighth)).toEqual(
      Array(4).fill(D.ThirtySecond)
    );
    expect(expand(D.Sixteenth)).toEqual(
      Array(2).fill(D.ThirtySecond)
    );
    expect(expand(D.ThirtySecond)).toEqual(
      Array(1).fill(D.ThirtySecond)
    );
  });
});

describe("simplify", () => {
  it("should convert a whole note to a whole note", () => {
    // Shorthand
    const d1 = D.Whole;
    const d2 = D.Half;
    const d4 = D.Quarter;
    const d8 = D.Eighth;
    const d16 = D.Sixteenth;
    const d32 = D.ThirtySecond;
    
    expect(simplify([d16, d16, d16])).toStrictEqual([d8, d16]);
    expect(simplify([d8])).toStrictEqual([d8]);
    expect(simplify([d8, d8])).toStrictEqual([d4]);
    expect(simplify([d4])).toStrictEqual([d4]);
    expect(simplify([d4, d4, d4])).toStrictEqual([d2, d4]);
    expect(simplify([d4, d4, d4, d4])).toStrictEqual([d1]);
    expect(simplify([d2])).toStrictEqual([d2]);
    expect(simplify([d2, d2])).toStrictEqual([d1]);
    expect(simplify([d2, d2, d2])).toStrictEqual([d1, d2]);
    expect(simplify(Array(31).fill(d16))).toStrictEqual([d1, d2, d4, d8, d16])
    expect(simplify([d16, d16, d1, d8, d1, d2, d8, d8])).toStrictEqual([d1, d1, d1]);
    expect(simplify([d8, d32, d8, d32])).toStrictEqual([d4, d16]);
  });
});

describe("split32nds", () => {
  it("should split an array in two halves", () => {
    const [notes, at] = [_32nds(32), _32nds(16)];
    expect(split32nds(notes, at)).toEqual([at, at]);
  });

  it("should split an odd amount of 32nd notes", () => {
    const [notes, at] = [_32nds(31), _32nds(7)];
    expect(split32nds(notes, at)).toEqual([at, _32nds(24)]);
  });

  it("should split after an entire array of 32nd notes", () => {
    const [notes, at] = [_32nds(1), _32nds(1)];
    expect(split32nds(notes, at)).toEqual([at, []]);
  });

  it("should split before an entire array of 32nd notes", () => {
    const [notes, at] = [_32nds(1), []];
    expect(split32nds(notes, at)).toEqual([[], notes]);
  });

  it("should split an empty array of 32nd notes", () => {
    const [notes, at] = [[], _32nds(1)];
    expect(split32nds(notes, at)).toEqual([[], []]);
  });
});

describe("split", () => {
  it("should split an array in two halves", () => {
    const [ds, length] = [[D.Whole], [D.Half]];
    expect(split(ds, length)).toEqual([
      length,
      length,
    ]);
  });

  it("should split an odd amount", () => {
    const [ds, length] = [[D.Quarter], simplify(_32nds(7))];
    expect(split(ds, length)).toEqual([
      length,
      [D.ThirtySecond],
    ]);
  });

  it("should split after an entire array", () => {
    const [ds, length] = [[D.Half], [D.Half]];
    expect(split(ds, length)).toEqual([length, []]);
  });

  it("should split into multiple parts", () => {
    const [ds, length] = [[D.Whole], [D.Quarter, D.Eighth]];
    expect(split(ds, length)).toEqual([
      length,
      [D.Half, D.Eighth],
    ]);
  });

  it("should split multiple durations", () => {
    const [ds, length]: [Duration[], Duration[]] = [
      [D.Whole, D.Half, D.Sixteenth],
      [D.Quarter, D.Eighth],
    ];
    expect(split(ds, length)).toEqual([
      [D.Quarter, D.Eighth],
      [D.Whole, D.Eighth, D.Sixteenth],
    ]);
  });

  it("should split multiple durations", () => {
    const [ds, length]: [Duration[], Duration[]] = [
      [D.Eighth, D.Quarter, D.Eighth, D.Eighth, D.Whole],
      tsTo32nds([3, D.Eighth]),
    ];
    expect(split(ds, length)).toEqual([
      [D.Quarter, D.Eighth],
      [D.Whole, D.Quarter],
    ]);
  });

  it("should split uneven durations", () => {
    expect(split([D.Whole], _32nds(11))).toEqual([
      [D.Quarter, D.Sixteenth, D.ThirtySecond],
      [D.Half, D.Eighth, D.ThirtySecond],
    ])

    expect(split([D.Half, D.Eighth, D.ThirtySecond], _32nds(11))).toEqual([
      [D.Quarter, D.Sixteenth, D.ThirtySecond],
      [D.Quarter, D.Sixteenth],
    ]);
  });
});