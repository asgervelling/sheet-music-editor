import { describe, it, expect } from "@jest/globals";

import { interval, stepInKey } from "./keys";
import { NoteName } from ".";

describe("stepInKey", () => {
  it("should give the correct step", () => {
    expect(stepInKey(NoteName.D, NoteName.G)).toEqual("5");
    expect(stepInKey(NoteName.G, NoteName.D)).toEqual("4");
    expect(stepInKey(NoteName.D, NoteName.D)).toEqual("1");
    expect(stepInKey(NoteName.D, NoteName.Eb)).toEqual("7");
    expect(stepInKey(NoteName.D, NoteName.E)).toEqual("b7");
    expect(stepInKey(NoteName.D, NoteName.C)).toEqual("2");
    expect(stepInKey(NoteName.D, NoteName.Db)).toEqual("b2");
  });
});

describe("interval", () => {
  it("should give the correct interval", () => {
    expect(interval(NoteName.A, NoteName.Db)).toEqual("3");
    expect(interval(NoteName.E, NoteName.F)).toEqual("b2");
    expect(interval(NoteName.G, NoteName.Gb)).toEqual("7");
    expect(interval(NoteName.G, NoteName.F)).toEqual("b7");

    expect(interval(NoteName.F, NoteName.Gb)).toEqual("b2");
    expect(interval(NoteName.F, NoteName.G)).toEqual("2");
    expect(interval(NoteName.F, NoteName.Ab)).toEqual("b3");
    expect(interval(NoteName.F, NoteName.A)).toEqual("3");
    expect(interval(NoteName.F, NoteName.Bb)).toEqual("4");
    expect(interval(NoteName.F, NoteName.B)).toEqual("b5");
    expect(interval(NoteName.F, NoteName.C)).toEqual("5");
    expect(interval(NoteName.F, NoteName.Db)).toEqual("b6");
    expect(interval(NoteName.F, NoteName.D)).toEqual("6");
    expect(interval(NoteName.F, NoteName.Eb)).toEqual("b7");
    expect(interval(NoteName.F, NoteName.E)).toEqual("7");
  });
});
