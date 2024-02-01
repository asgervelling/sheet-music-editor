import { describe, it, expect } from "@jest/globals";

import {
  chunk,
  expandTo32nds,
  groupTiedEvents,
  reciprocalChunk,
  simplify,
  simplifyPair,
  tieGroup,
} from "./events";
import {
  c1,
  c2,
  c4,
  c8,
  c16,
  c32,
  e2,
  e4,
  e16,
  e8,
  e32,
  p1,
  p2,
  p4,
  p8,
  p16,
  p32,
  c32t,
  c16t,
  c8t,
  c4t,
  c2t,
  c1t,
  e2t,
  e16t,
  e4t,
  e8t,
  e32t,
  e1t,
} from "./test_helpers";
import { repeat } from "./arrays";

describe("expandTo32nds", () => {
  it("should expand a 32nd note to an untied 32nd note", () => {
    expect(expandTo32nds(c32)).toEqual([c32]);
  });

  it("should expand a tied 32nd note to a tied 32nd note", () => {
    expect(expandTo32nds(c32t)).toEqual([c32t]);
  });

  it("should expand a 16th note to a tied and an untied 32nd note", () => {
    expect(expandTo32nds(c16)).toEqual([c32t, c32]);
  });

  it("should expand an 8th note to 3 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c8)).toEqual([...repeat(c32t, 3), c32]);
  });

  it("should expand a quarter note to 7 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c4)).toEqual([...repeat(c32t, 7), c32]);
  });

  it("should expand a half note to 15 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c2)).toEqual([...repeat(c32t, 15), c32]);
  });

  it("should expand a whole note to 31 tied and 1 untied 32nd note", () => {
    expect(expandTo32nds(c1)).toEqual([...repeat(c32t, 31), c32]);
  });

  it("should expand a tied note to only tied notes", () => {
    expect(expandTo32nds(c32t)).toEqual([c32t]);
    expect(expandTo32nds(c16t)).toEqual([c32t, c32t]);
    expect(expandTo32nds(c8t)).toEqual(repeat(c32t, 4));
    expect(expandTo32nds(c4t)).toEqual(repeat(c32t, 8));
    expect(expandTo32nds(c2t)).toEqual(repeat(c32t, 16));
    expect(expandTo32nds(c1t)).toEqual(repeat(c32t, 32));
  });
});

describe("chunk", () => {
  it("should divide one event into one chunk", () => {
    expect(chunk([e2], [16])).toEqual([[e2]]);
  });

  it("should divide two events into two chunks no matter their tied status", () => {
    expect(chunk([e2, c2], [16, 16])).toEqual([[e2], [c2]]);
    expect(chunk([e2t, c2], [16, 16])).toEqual([[e2t], [c2]]);
    expect(chunk([e2, c2t], [16, 16])).toEqual([[e2], [c2t]]);
    expect(chunk([e2t, c2t], [16, 16])).toEqual([[e2t], [c2t]]);
  });

  it("should divide two events into three chunks", () => {
    expect(chunk([e2, c2], [10, 12, 10])).toEqual([
      [e16t, e4t],
      [e16t, e8, c16t, c8t],
      [c16t, c4],
    ]);
  });

  it("should divide events into weirdly sized chunks", () => {
    expect(chunk([e2, c2], [7, 12, 13])).toEqual([
      [e32t, e16t, e8t],
      [e32t, e4, c32t, c16t],
      [c32t, c8t, c4],
    ]);
  });

  it("should divide three events into one chunk", () => {
    expect(chunk([e4, c4, e4], [24])).toEqual([[e4, c4, e4]]);
  });

  it("should divide three events into two chunks", () => {
    expect(chunk([e4, c4, e4], [11, 13])).toEqual([
      // Three quarter notes, E, C and E,
      // split into two measures of 11/32 and 13/32
      [e4, c32t, c16t],
      [c32t, c8, e4],
    ]);
  });

  it("should do some uneven splits", () => {
    expect(chunk([e32, c2], [2, 3, 5, 7])).toEqual([
      [e32, c32t],
      [c32t, c16t],
      [c32t, c8t],
      [c32t, c16t, c8],
    ]);
  });

  it("more weird splits", () => {
    expect(chunk([c1], [11, 11, 10])).toEqual([
      [c32t, c16t, c4t],
      [c32t, c16t, c4t],
      [c16t, c4],
    ]);
  });
});

describe("groupTiedEvents", () => {
  it("should create one group from a single untied event", () => {
    expect(groupTiedEvents([c1])).toEqual([[c1]]);
  });

  it("should create one group from a single tied event", () => {
    expect(groupTiedEvents([c1t])).toEqual([[c1t]]);
  });

  it("should create one group from many tied events", () => {
    expect(groupTiedEvents(repeat(c32t, 15))).toEqual([repeat(c32t, 15)]);
    expect(groupTiedEvents(repeat(c32t, 154))).toEqual([repeat(c32t, 154)]);
  });

  it("should create two groups from two untied events", () => {
    expect(groupTiedEvents([c2, c4])).toEqual([[c2], [c4]]);
  });

  it("should create two groups from two tied events with different notes", () => {
    expect(groupTiedEvents([c2t, e4])).toEqual([[c2t], [e4]]);
  });

  it("should create one group from two tied events with the same notes", () => {
    expect(groupTiedEvents([c2t, c4])).toEqual([[c2t, c4]]);
  });

  it("should create a group where the last event is tied", () => {
    expect(groupTiedEvents([c2t, c4t])).toEqual([[c2t, c4t]]);
  });

  it("should create three groups from a tied, an untied and a tied event with alternating notes", () => {
    expect(groupTiedEvents([e4t, c4, e4t])).toEqual([[e4t], [c4], [e4t]]);
  });

  it("should create many groups", () => {
    expect(
      groupTiedEvents([c32t, c1t, e1t, e1t, e4, e16t, c16, c32t, c32t])
    ).toEqual([[c32t, c1t], [e1t, e1t, e4], [e16t], [c16], [c32t, c32t]]);
  });

  it("should create zero groups from zero events", () => {
    expect(groupTiedEvents([])).toEqual([]);
  });

  it("should create one group from two whole notes", () => {
    expect(groupTiedEvents([c1t, c1])).toEqual([[c1t, c1]]);
  });

  it("should group 32nd notes", () => {
    expect(groupTiedEvents([...repeat(e32t, 5), e32])).toEqual([
      [...repeat(e32t, 5), e32],
    ]);
  });
});

describe("simplifyPair", () => {
  it("should simplify two 32nds to a 16th", () => {
    expect(simplifyPair(c32, c32)).toEqual([c16]);
  });

  it("should simplify two 16ths to an 8th", () => {
    expect(simplifyPair(c16, c16)).toEqual([c8]);
  });

  it("should simplify two 8ths to a quarter", () => {
    expect(simplifyPair(c8, c8)).toEqual([c4]);
  });

  it("should simplify two quarters to a half", () => {
    expect(simplifyPair(c4, c4)).toEqual([c2]);
  });

  it("should simplify two halves to a whole", () => {
    expect(simplifyPair(c2, c2)).toEqual([c1]);
  });

  it("should not simplify two whole notes", () => {
    expect(simplifyPair(c1, c1)).toEqual([c1, c1]);
  });

  it("should be tied or not tied based on the second event", () => {
    expect(simplifyPair(c2t, c2)).toEqual([c1]);
    expect(simplifyPair(c2, c2t)).toEqual([c1t]);
    expect(simplifyPair(c2t, c2t)).toEqual([c1t]);
  });
});

describe("tieGroup", () => {
  it("should tie together events that are all tied", () => {
    expect(tieGroup([c1t, c2t])).toEqual([c1t, c2t]);
  });
  
  it("should set all events except the last to tied, if the last one is not tied", () => {
    expect(tieGroup([c1, c2])).toEqual([c1t, c2]);
    expect(tieGroup([c1t, c2])).toEqual([c1t, c2]);
    expect(tieGroup([e8t, e16])).toEqual([e8t, e16]);
  });

  it("should not fail when group is empty", () => {
    expect(tieGroup([])).toEqual([]);
  });

  // [([C], 16, t), ([C], 8, t), ([C], q, t), ([C], h, t), ([C], w, t), ([C], w, t), ([C], w, t)]
  it("should tie together events that are all tied", () => {
    expect(tieGroup([c16t, c8t, c4t, c2t, c1t, c1t, c1t])).toEqual([
      c16t,
      c8t,
      c4t,
      c2t,
      c1t,
      c1t,
      c1t,
    ]);
  });
});

describe("simplify", () => {
  it("should not simplify whole notes", () => {
    expect(simplify([c1t, c1])).toEqual([c1t, c1]);
  });

  it("should simplify two 32nd notes", () => {
    expect(simplify([c32t, c32])).toEqual([c16]);
  });

  it("should simplify three tied 32nd notes", () => {
    expect(simplify([c32t, c32t, c32t])).toEqual([c32t, c16t]);
  });

  it("should simplify four tied 32nd notes", () => {
    expect(simplify([c32t, c32t, c32t, c32t])).toEqual([c8t]);
  });

  it("should simplify two groups", () => {
    expect(simplify([c8t, c8, e32t, e32])).toEqual([c4, e16]);
  });

  it("should simplify a pair of each duration", () => {
    expect(simplify([c32t, c32t, c16t, c16t])).toEqual([c16t, c8t]);
    expect(
      simplify([c32t, c32, c16t, c16, c8t, c8, c4t, c4, c2t, c2, c1t, c1t])
    ).toEqual([c16, c8, c4, c2, c1, c1t, c1t]);
    expect(
      simplify([c32t, c32t, c16t, c16t, c8t, c8t, c4t, c4t, c2t, c2t, c1t, c1t])
    ).toEqual([c16t, c8t, c4t, c2t, c1t, c1t, c1t]);
  });

  it("should simplify tied events to the same, no matter the order", () => {
    expect(simplify([c4t, c8t, c8t, c8t])).toEqual([c8t, c2t]);
    expect(simplify([c8t, c4t, c8t, c8t])).toEqual([c8t, c2t]);
    expect(simplify([c8t, c8t, c4t, c8t])).toEqual([c8t, c2t]);
    expect(simplify([c8t, c8t, c8t, c4t])).toEqual([c8t, c2t]);
  });

  it("should simplify many tied events in jumbled order", () => {
    expect(
      simplify([c8t, c1t, c2t, c32t, c16t, c1t, c8t, c4t, c32t, c4t, c2t, c16t])
    ).toEqual([c16t, c8t, c4t, c2t, c1t, c1t, c1t]);
  });

  it("should simplify many events to a single event", () => {
    expect(simplify([c32t, c32t, c16t, c8t, c4t, c2t])).toEqual([c1t]);
  });

  it("should simplify three groups I was having trouble with", () => {
    expect(simplify(repeat(e32t, 10))).toEqual([e16t, e4t]);
    expect(simplify([...repeat(e32t, 5), e32])).toEqual([e16t, e8]);
    expect(simplify([...repeat(c32t, 9), c32])).toEqual([c16t, c4]);
  });
});

describe("reciprocalChunk", () => {
  it("should fill up an empty chunk of 4/4", () => {
    expect(reciprocalChunk([], 32)).toEqual([p1]);
  });

  it("should fill up an empty chunk of 3/4", () => {
    expect(reciprocalChunk([], 24)).toEqual([p4, p2]);
  });

  it("should fill up an empty chunk of 15/32", () => {
    expect(reciprocalChunk([], 15)).toEqual([p32, p16, p8, p4]);
  });

  it("should not fill up a complete or overfull chunk", () => {
    expect(reciprocalChunk([c32], 1)).toEqual([]);
    expect(reciprocalChunk([c1], 32)).toEqual([]);
    expect(reciprocalChunk([c1], 31)).toEqual([]);
  });

  it("should fill up semi-complete chunks of various lengths", () => {
    expect(reciprocalChunk([e32], 2)).toEqual([p32]);
    expect(reciprocalChunk([e32], 3)).toEqual([p16]);
    expect(reciprocalChunk([c4t, c8, c8, e32t, e16], 34)).toEqual([
      p32,
      p16,
      p8,
      p4,
    ]);
  });
});
