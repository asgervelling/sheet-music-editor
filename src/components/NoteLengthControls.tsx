"use client";
import NoteLengthIndicator from "./NoteLengthIndicator";
import { NoteLength } from "@/app/state/music_theory";

export default function NoteLengthControls() {
  return (
    <div className="grid grid-flow-col justify-start gap-1">
      <NoteLengthIndicator noteLength={NoteLength.Whole} />
      <NoteLengthIndicator noteLength={NoteLength.Half} />
      <NoteLengthIndicator noteLength={NoteLength.Quarter} />
      <NoteLengthIndicator noteLength={NoteLength.Eighth} />
      <NoteLengthIndicator noteLength={NoteLength.Sixteenth} />
    </div>
  );
};