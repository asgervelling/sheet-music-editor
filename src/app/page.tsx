"use client";
import History from "@/components/History";
import {
  DurationIndicatorGroup,
  EnterKeyIndicator,
  RedoIndicatorGroup,
  UndoIndicatorGroup,
} from "@/components/indicators";
import KeyDispatcher from "@/components/KeyDispatcher";
import Piano from "@/components/Piano";
import { SheetMusicSystem } from "@/components/scores";

import { Bar, Duration, Note } from "./state/music";
import { StateProvider } from "./state/StateContext";
import { parseTimeSignature, toFullBar } from "./state/music/bars";

export default function Home() {
  const bars: Bar[] = [
    {
      timeSignature: parseTimeSignature("4/4"),
      events: [
        {
          notes: [Note.C, Note.E],
          duration: Duration.Whole,
        },
      ],
    },
    {
      timeSignature: parseTimeSignature("4/4"),
      events: [
        {
          notes: [Note.D],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.E, Note.G],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.G],
          duration: Duration.Quarter,
        },
      ],
    },
  ];

  return (
    <StateProvider>
      <KeyDispatcher />
      {/* 2x2 grid */}
      <div className="grid grid-cols-2 grid-rows-2 h-screen">
        {/* Top left quarter */}
        <div className="py-20 px-32">
          <DurationIndicatorGroup />
          <div className="grid gap-y-2">
            <UndoIndicatorGroup />
            <RedoIndicatorGroup />
          </div>
        </div>
        {/* Top right quarter */}
        <div className="py-18 px-40 flex flex-col items-center justify-center">
          <Piano />
          <div className="w-full pt-4">
            <div className="flex justify-end">
              <EnterKeyIndicator />
            </div>
          </div>
        </div>
        {/* Bottom half */}
        <div className="py-20 px-32 col-span-2">
          <History />
          <SheetMusicSystem bars={bars} />
        </div>
      </div>
    </StateProvider>
  );
}
