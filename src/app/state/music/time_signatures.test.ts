import { describe, it, expect } from "@jest/globals";
import { Duration } from "./durations";
import { TimeSignature, _32ndsToTs, canSimplify, simplifyTs, tsTo32nds } from "./time_signatures";
import { repeat } from "./arrays";

const _3_4: TimeSignature = [3, Duration.Quarter];
const _4_4: TimeSignature = [4, Duration.Quarter];
const _5_8: TimeSignature = [5, Duration.Eighth];
const _13_16: TimeSignature = [13, Duration.Sixteenth];
const _27_32: TimeSignature = [27, Duration.ThirtySecond];
const _32_32: TimeSignature = [32, Duration.ThirtySecond];
const _18_16: TimeSignature = [18, Duration.Sixteenth];
const _12_8: TimeSignature = [12, Duration.Eighth];
const _1_1: TimeSignature = [1, Duration.Whole];

describe("tsTo32nds", () => {
  it("should turn a time signature into an array of 32nd notes", () => {
    expect(tsTo32nds(_3_4)).toStrictEqual(repeat(Duration.ThirtySecond, 24));
    expect(tsTo32nds(_4_4)).toStrictEqual(repeat(Duration.ThirtySecond, 32));
    expect(tsTo32nds(_5_8)).toStrictEqual(repeat(Duration.ThirtySecond, 20));
    expect(tsTo32nds(_13_16)).toStrictEqual(repeat(Duration.ThirtySecond, 26));
    expect(tsTo32nds(_27_32)).toStrictEqual(repeat(Duration.ThirtySecond, 27));
    expect(tsTo32nds(_32_32)).toStrictEqual(repeat(Duration.ThirtySecond, 32));
    expect(tsTo32nds(_18_16)).toStrictEqual(repeat(Duration.ThirtySecond, 36));
    expect(tsTo32nds(_12_8)).toStrictEqual(repeat(Duration.ThirtySecond, 48));
    expect(tsTo32nds(_1_1)).toStrictEqual(repeat(Duration.ThirtySecond, 32));
  });
});

describe("_32ndsToTs", () => {
  it("should turn an array of 32nd notes into a valid time signature", () => {
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 24))).toStrictEqual(simplifyTs(_3_4));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 32))).toStrictEqual(simplifyTs(_4_4));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 20))).toStrictEqual(simplifyTs(_5_8));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 26))).toStrictEqual(simplifyTs(_13_16));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 27))).toStrictEqual(simplifyTs(_27_32));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 32))).toStrictEqual(simplifyTs(_32_32));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 36))).toStrictEqual(simplifyTs(_18_16));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 48))).toStrictEqual(simplifyTs(_12_8));
    expect(_32ndsToTs(repeat(Duration.ThirtySecond, 32))).toStrictEqual(simplifyTs(_1_1));
  });
});

describe("canSimplify", () => {
  it("should return true if the time signature can be simplified", () => {    
    expect(canSimplify(_3_4)).toBe(false);
    expect(canSimplify(_4_4)).toBe(true);
    expect(canSimplify(_5_8)).toBe(false);
    expect(canSimplify(_13_16)).toBe(false);
    expect(canSimplify(_27_32)).toBe(false);
    expect(canSimplify(_32_32)).toBe(true);
    expect(canSimplify(_18_16)).toBe(true);
    expect(canSimplify(_12_8)).toBe(true);
    expect(canSimplify(_1_1)).toBe(false);
  });
});

describe("simplifyTs", () => {
  it("should simplify timestamps to their irreducible form", () => {
    expect(simplifyTs(_3_4)).toEqual(_3_4);
    expect(simplifyTs(_4_4)).toEqual([1, Duration.Whole]);
    expect(simplifyTs(_5_8)).toEqual(_5_8);
    expect(simplifyTs(_13_16)).toEqual(_13_16);
    expect(simplifyTs(_27_32)).toEqual(_27_32);
    expect(simplifyTs(_32_32)).toEqual([1, Duration.Whole]);
    expect(simplifyTs(_18_16)).toEqual([9, Duration.Eighth]);
    expect(simplifyTs(_12_8)).toEqual([3, Duration.Half]);
    expect(simplifyTs(_1_1)).toEqual([1, Duration.Whole]);
  });
})