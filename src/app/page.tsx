"use client";
import { StateProvider } from "./state/StateContext";
import Piano from "@/components/Piano";
import DurationIndicatorGroup from "@/components/indicators/DurationIndicatorGroup";
import KeyDispatcher from "@/components/KeyDispatcher";
import History from "@/components/History";
import EnterKeyIndicator from "@/components/indicators/EnterKeyIndicator";
import UndoIndicatorGroup from "@/components/indicators/UndoIndicatorGroup";
import RedoIndicatorGroup from "@/components/indicators/RedoIndicatorGroup";
import SheetMusicBar from "@/components/SheetMusicBar";
import { Duration, Note, MusicalEvent } from "./state/music";

export default function Home() {
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
          
          <SheetMusicBar
            timeSignature="4/4"
            events={[
              {
                notes: [Note.D, Note.E, Note.G],
                duration: Duration.Quarter,
              },
              {
                notes: [Note.C],
                duration: Duration.Quarter,
              },
              {
                notes: [Note.C, Note.E, Note.G],
                duration: Duration.Quarter,
              },
              {
                notes: [Note.C, Note.E, Note.G],
                duration: Duration.Quarter,
              },
            ]}
            pos={0}
          />
        </div>
      </div>
    </StateProvider>
  );
}
