import { describe, it, expect } from "@jest/globals";

import { stepInKey } from "./keys";
import { Note } from ".";

describe("stepInKey", () => {
  it("should give the correct step", () => {
    console.log(stepInKey(Note.D, Note.G)); // "5"
  })
})