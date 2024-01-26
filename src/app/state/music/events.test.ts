import { describe, it, expect } from "@jest/globals";

import {
  chunkEvents,
  expandTo32nds,
  findEventGroups,
  firstGroupLength,
  groupTiedEvents,
  simplify,
  simplifyPair,
} from "./events";
import {
  repeat,
  c1,
  c2,
  c4,
  c8,
  c16,
  c32,
  tiedToNext,
  fmtChunk,
  fmtEvent,
  e1,
  e2,
  e4,
  e16,
  e8,
  e32,
  fmtChunks,
} from "./test_helpers";

const c1t = tiedToNext(c1);
const c2t = tiedToNext(c2);
const c4t = tiedToNext(c4);
const c8t = tiedToNext(c8);
const c16t = tiedToNext(c16);
const c32t = tiedToNext(c32);
const e1t = tiedToNext(e1);
const e2t = tiedToNext(e2);
const e4t = tiedToNext(e4);
const e8t = tiedToNext(e8);
const e16t = tiedToNext(e16);
const e32t = tiedToNext(e32);

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
});

describe("chunkEvents", () => {
  it("should divide one event into one chunk", () => {
    expect(chunkEvents([e2], [16])).toEqual([[...repeat(e32t, 15), e32]]);
  });

  it("should divide two events into two chunks", () => {
    expect(chunkEvents([e2, c2], [16, 16])).toEqual([
      [...repeat(e32t, 15), e32],
      [...repeat(c32t, 15), c32],
    ]);
  });

  it("should divide two events into three chunks", () => {
    expect(chunkEvents([e2, c2], [10, 12, 10])).toEqual([
      [...repeat(e32t, 10)],
      [...repeat(e32t, 5), e32, ...repeat(c32t, 6)],
      [...repeat(c32t, 9), c32],
    ]);
  });

  it("should divide three events into one chunkEvents", () => {
    expect(chunkEvents([e4, c4, e4], [24])).toEqual([
      [
        ...repeat(e32t, 7),
        e32,
        ...repeat(c32t, 7),
        c32,
        ...repeat(e32t, 7),
        e32,
      ],
    ]);
  });

  it("should divide three events into two chunks", () => {
    expect(chunkEvents([e4, c4, e4], [11, 13])).toEqual([
      // Three quarter notes, E, C and E,
      // split into two measures of 11/32 and 13/32
      [...repeat(e32t, 7), e32, ...repeat(c32t, 3)],
      [...repeat(c32t, 4), c32, ...repeat(e32t, 7), e32],
    ]);
  });

  it("should throw an error when the events don't match the chunks", () => {
    expect(() => chunkEvents([c4], [1])).toThrow();
    expect(() => chunkEvents([c4], [])).toThrow();
  });

  it("should do some uneven splits", () => {
    expect(chunkEvents([e32, c2], [2, 3, 5, 7])).toEqual([
      [e32, c32t],
      repeat(c32t, 3),
      repeat(c32t, 5),
      [...repeat(c32t, 6), c32],
    ]);
  });

  it("should handle a weird time signature", () => {
    expect(chunkEvents([c1], [11, 11, 10])).toEqual([
      repeat(c32t, 11),
      repeat(c32t, 11),
      [...repeat(c32t, 9), c32],
    ]);
  });
});

describe("firstGroupLength", () => {
  it("should recognize a group of tied events", () => {
    expect(firstGroupLength([e32t, e32t, e32t, e32])).toEqual(4);
  });

  it("should return 1 for an event followed by an event with different notes", () => {
    expect(firstGroupLength([c32, e32])).toEqual(1);
  });

  it("should return 1 for a tied event followed by an event with different notes", () => {
    expect(firstGroupLength([c32t, e32])).toEqual(1);
  });

  it("should return 1 for a tied event followed by a tied event with different notes", () => {
    expect(firstGroupLength([c32t, e32t])).toEqual(1);
  });

  it("should recognize different groups with the same notes", () => {
    expect(firstGroupLength([c16, c16, c4t, c4, c4])).toEqual(1);
    expect(firstGroupLength([c16, c4t, c4, c4])).toEqual(1);
    expect(firstGroupLength([c4t, c4, c4])).toEqual(2);
    expect(firstGroupLength([c4, c4])).toEqual(1);
    expect(firstGroupLength([c4])).toEqual(1);
  });

  it("should recognize a group of events with different lengths", () => {
    expect(firstGroupLength([c32t, c4t, c16])).toEqual(3);
  });

  it("should recognize a group of events with different lengths, then a tied event with different notes", () => {
    expect(firstGroupLength([c32t, c4t, e2t])).toEqual(2);
  });
});

describe("findEventGroups", () => {
  it("should group a single untied event as a single group", () => {
    expect(findEventGroups([c32])).toEqual([[c32]]);
  });

  it("should group a single tied event as a single group consisting of an untied event", () => {
    expect(findEventGroups([c32t])).toEqual([[c32]]);
  });

  it("should not find groups in an empty array", () => {
    expect(findEventGroups([])).toEqual([]);
  });

  it("should recognize tied events and an untied event", () => {
    expect(findEventGroups([c32t, c4t, c16])).toEqual([[c32t, c4t, c16]]);
  });

  it("should recognize untied events with same notes as different groups", () => {
    expect(findEventGroups([c32, c4, c16])).toEqual([[c32], [c4], [c16]]);
  });

  it("should recognize tied events, all with different notes, as different groups", () => {
    expect(findEventGroups([c32t, e2t, c16t])).toEqual([[c32], [e2], [c16]]);
  });

  it("should recognize tied events, as a single group with an untied event at the end", () => {
    expect(findEventGroups([c32t, c32t, c32t])).toEqual([[c32t, c32t, c32]]);
  });

  it("should find two groups", () => {
    expect(findEventGroups([e2, c2])).toEqual([[e2], [c2]]);
  });
});

// describe("simplifyChunks", () => {
//   it("should simplify a single chunk", () => {
//     expect(simplifyChunks([[c32t, c32t, c32]])).toEqual([[c16t, c32]]);
//   });

//   it("should simplify a single chunk of events with different durations", () => {
//     expect(simplifyChunks([[c8t, c8t, c4t, c32]])).toEqual([[c2t, c32]]);
//   });

//   it("should simplify multiple chunks", () => {
//     expect(
//       simplifyChunks([[c8, c8t, c8t, c1], [], [e32, e32, c32t, c32t, c16t, e16]])
//     ).toEqual([[c8, c1t, c4], [], [e32, e32, c8, e16]]);
//   });

//   it("should simplify across chunk borders", () => {
//     expect(simplifyChunks([[c2], [e2]]))
//   })
// });

// describe("chunk", () => {
//   it("should divide one event into one chunk", () => {
//     expect(chunk([e2], [16])).toEqual([[e2]]);
//   });

//   it("should divide two events into two chunks", () => {
//     expect(chunk([e2, c2], [16, 16])).toEqual([[e2], [c2]]);
//   });

//   it("should divide two events into three chunks", () => {
//     // 32, 16, 8, 4, 2,  1
//     // 1,  2,  4, 8, 16, 32
//     expect(chunk([e2, c2], [10, 12, 10])).toEqual([
//       [e4t, e16t],
//       [e8t, e16, c8t, c16t],
//       [c4t, c16],
//     ]);
//   });
// })

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

  it("should create one groups from two tied events with the same notes", () => {
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

describe("simplify", () => {
  it("should not simplify whole notes", () => {
    expect(simplify([c1t, c1])).toEqual([c1t, c1]);
  });

  it("should simplify two 32nd notes", () => {
    expect(simplify([c32t, c32])).toEqual([c16]);
  });

  it("should simplify three tied 32nd notes", () => {
    expect(simplify([c32t, c32t, c32t])).toEqual([c16t, c32t]);
  });

  it("should simplify four tied 32nd notes", () => {
    expect(simplify([c32t, c32t, c32t, c32t])).toEqual([c8t]);
  });

  it("should simplify a pair of each duration", () => {
    expect(
      simplify([c32t, c32, c16t, c16, c8t, c8, c4t, c4, c2t, c2, c1t, c1t])
    ).toEqual([c16, c8, c4, c2, c1, c1t, c1t]);
    expect(
      simplify([c32t, c32t, c16t, c16t, c8t, c8t, c4t, c4t, c2t, c2t, c1t, c1t])
    ).toEqual([c1t, c1t, c1t, c2t, c4t, c8t, c16t]);
  });

  it("should simplify tied events to the same, no matter the order", () => {
    expect(simplify([c4t, c8t, c8t, c8t])).toEqual([c2t, c8t]);
    expect(simplify([c8t, c4t, c8t, c8t])).toEqual([c2t, c8t]);
    expect(simplify([c8t, c8t, c4t, c8t])).toEqual([c2t, c8t]);
    expect(simplify([c8t, c8t, c8t, c4t])).toEqual([c2t, c8t]);
  })

  it("should simplify many tied events in jumbled order", () => {
    console.log(fmtChunk(simplify([c8t, c1t, c2t, c32t, c16t, c1t, c8t, c4t, c32t, c4t, c2t, c16t])))
    expect(
      simplify([c8t, c1t, c2t, c32t, c16t, c1t, c8t, c4t, c32t, c4t, c2t, c16t])
    ).toEqual([c1t, c1t, c1t, c2t, c4t, c8t, c16t]);
  })

  it("should simplify many events to a single event", () => {
    expect(simplify([c32t, c32t, c16t, c8t, c4t, c2t])).toEqual([c1t]);
  })
});
