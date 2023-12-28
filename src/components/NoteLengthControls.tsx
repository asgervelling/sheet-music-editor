"use client";
import NoteLengthKey from "./NoteLengthKey";
import { NoteLength } from "@/lib/music_theory";

export default function NoteLengthControls() {
  return (
    <div className="grid grid-flow-col justify-start gap-1">
      <NoteLengthKey noteLength={NoteLength.Whole} />
      <NoteLengthKey noteLength={NoteLength.Half} />
      <NoteLengthKey noteLength={NoteLength.Quarter} />
      <NoteLengthKey noteLength={NoteLength.Eighth} />
      <NoteLengthKey noteLength={NoteLength.Sixteenth} />
    </div>
  );
};