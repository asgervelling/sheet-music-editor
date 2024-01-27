import { describe, it, expect } from "@jest/globals";

import { expandDuration } from "./durations";
import { D, _32nds } from "./test_helpers";

describe("expandDuration", () => {
  it("should convert a duration to an array of sixteenths", () => {
    expect(expandDuration(D.Whole)).toEqual(Array(32).fill(D.ThirtySecond));
    expect(expandDuration(D.Half)).toEqual(Array(16).fill(D.ThirtySecond));
    expect(expandDuration(D.Quarter)).toEqual(Array(8).fill(D.ThirtySecond));
    expect(expandDuration(D.Eighth)).toEqual(Array(4).fill(D.ThirtySecond));
    expect(expandDuration(D.Sixteenth)).toEqual(Array(2).fill(D.ThirtySecond));
    expect(expandDuration(D.ThirtySecond)).toEqual(Array(1).fill(D.ThirtySecond));
  });
});
