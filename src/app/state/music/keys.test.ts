import { describe, it, expect } from "@jest/globals";

import { interval, stepInKey } from "./keys";
import { Note } from ".";

describe("stepInKey", () => {
  it("should give the correct step", () => {
    expect(stepInKey(Note.D, Note.G)).toEqual("5");
    expect(stepInKey(Note.G, Note.D)).toEqual("4");
    expect(stepInKey(Note.D, Note.D)).toEqual("1");
    expect(stepInKey(Note.D, Note.Eb)).toEqual("7");
    expect(stepInKey(Note.D, Note.E)).toEqual("b7");
    expect(stepInKey(Note.D, Note.C)).toEqual("2");
    expect(stepInKey(Note.D, Note.Db)).toEqual("b2");
  });
});

describe("interval", () => {
  it("should give the correct interval", () => {
    expect(interval(Note.A, Note.Db)).toEqual("3");
    expect(interval(Note.E, Note.F)).toEqual("b2");
    expect(interval(Note.G, Note.Gb)).toEqual("7");
    expect(interval(Note.G, Note.F)).toEqual("b7");

    expect(interval(Note.F, Note.Gb)).toEqual("b2");
    expect(interval(Note.F, Note.G)).toEqual("2");
    expect(interval(Note.F, Note.Ab)).toEqual("b3");
    expect(interval(Note.F, Note.A)).toEqual("3");
    expect(interval(Note.F, Note.Bb)).toEqual("4");
    expect(interval(Note.F, Note.B)).toEqual("b5");
    expect(interval(Note.F, Note.C)).toEqual("5");
    expect(interval(Note.F, Note.Db)).toEqual("b6");
    expect(interval(Note.F, Note.D)).toEqual("6");
    expect(interval(Note.F, Note.Eb)).toEqual("b7");
    expect(interval(Note.F, Note.E)).toEqual("7");
  });
});
