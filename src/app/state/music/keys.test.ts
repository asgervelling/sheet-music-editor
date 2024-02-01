import { describe, it, expect } from "@jest/globals";

import { interval, stepInKey } from "./keys";
import { NoteName } from ".";
import { Note } from "./events";

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
  // HARDCODED octave
  const note = (name: NoteName): Note => ({ name, octave: 4 });
  const NN = NoteName;

  it("should give the correct interval", () => {
    expect(interval(note(NN.A), note(NN.Db))).toEqual("3");
    expect(interval(note(NN.E), note(NN.F))).toEqual("b2");
    expect(interval(note(NN.G), note(NN.Gb))).toEqual("7");
    expect(interval(note(NN.G), note(NN.F))).toEqual("b7");

    expect(interval(note(NN.F), note(NN.Gb))).toEqual("b2");
    expect(interval(note(NN.F), note(NN.G))).toEqual("2");
    expect(interval(note(NN.F), note(NN.Ab))).toEqual("b3");
    expect(interval(note(NN.F), note(NN.A))).toEqual("3");
    expect(interval(note(NN.F), note(NN.Bb))).toEqual("4");
    expect(interval(note(NN.F), note(NN.B))).toEqual("b5");
    expect(interval(note(NN.F), note(NN.C))).toEqual("5");
    expect(interval(note(NN.F), note(NN.Db))).toEqual("b6");
    expect(interval(note(NN.F), note(NN.D))).toEqual("6");
    expect(interval(note(NN.F), note(NN.Eb))).toEqual("b7");
    expect(interval(note(NN.F), note(NN.E))).toEqual("7");
  });
});
