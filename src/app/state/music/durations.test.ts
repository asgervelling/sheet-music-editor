import { describe, it, expect } from "@jest/globals";

import { toDuration, toFraction, toSixteenths } from "./durations";
import { Duration } from ".";

describe("toFraction", () => {
  it("should convert a duration to a fraction", () => {
    expect(toFraction(Duration.Whole)).toBe(1);
    expect(toFraction(Duration.Half)).toBe(1 / 2);
    expect(toFraction(Duration.Quarter)).toBe(1 / 4);
    expect(toFraction(Duration.Eighth)).toBe(1 / 8);
    expect(toFraction(Duration.Sixteenth)).toBe(1 / 16);
  });
});

describe("toDuration", () => {
  it("should convert a normal fraction to a duration", () => {
    expect(toDuration(1)).toBe(Duration.Whole);
    expect(toDuration(1 / 2)).toBe(Duration.Half);
    expect(toDuration(1 / 4)).toBe(Duration.Quarter);
    expect(toDuration(1 / 8)).toBe(Duration.Eighth);
    expect(toDuration(1 / 16)).toBe(Duration.Sixteenth);
  });

  it("should throw an error if the fraction is not a normal fraction", () => {
    expect(() => toDuration(1 / 3)).toThrow();
  });
});

describe("toSixteenths", () => {
  it("should convert a duration to an array of sixteenths", () => {
    expect(toSixteenths(Duration.Whole)).toEqual(Array(16).fill(Duration.Sixteenth));
    expect(toSixteenths(Duration.Half)).toEqual(Array(8).fill(Duration.Sixteenth));
    expect(toSixteenths(Duration.Quarter)).toEqual(Array(4).fill(Duration.Sixteenth));
    expect(toSixteenths(Duration.Eighth)).toEqual(Array(2).fill(Duration.Sixteenth));
    expect(toSixteenths(Duration.Sixteenth)).toEqual(Array(1).fill(Duration.Sixteenth));
  });
});