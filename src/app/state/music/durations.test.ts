import { describe, it, expect } from "@jest/globals";

import { expand } from "./durations";
import { D, _32nds } from "./test_helpers";

describe("expand", () => {
  it("should convert a duration to an array of sixteenths", () => {
    expect(expand(D.Whole)).toEqual(Array(32).fill(D.ThirtySecond));
    expect(expand(D.Half)).toEqual(Array(16).fill(D.ThirtySecond));
    expect(expand(D.Quarter)).toEqual(Array(8).fill(D.ThirtySecond));
    expect(expand(D.Eighth)).toEqual(Array(4).fill(D.ThirtySecond));
    expect(expand(D.Sixteenth)).toEqual(Array(2).fill(D.ThirtySecond));
    expect(expand(D.ThirtySecond)).toEqual(Array(1).fill(D.ThirtySecond));
  });
});
