import { NoteLength } from "@/app/state/music_theory"
import React from "react";
import { WholeNoteIcon } from "./WholeNoteIcon";
import HalfNoteIcon from "./HalfNoteIcon";
import QuarterNoteIcon from "./QuarterNoteIcon";
import EighthNoteIcon from "./EighthNoteIcon";
import SixteenthNoteIcon from "./SixteenthNoteIcon";

type NoteLengthSVGProps = {
  noteLength: NoteLength;
};

export default function NoteLengthIcon({ noteLength }: NoteLengthSVGProps) {
  return (
    <div className="h-10 w-10 -translate-x-1">
      <Icon noteLength={noteLength} />
    </div>
  );
}

function Icon({ noteLength }: NoteLengthSVGProps) {
  switch (noteLength) {
    case NoteLength.Whole:
      return WholeNoteIcon();
    case NoteLength.Half:
      return HalfNoteIcon();
    case NoteLength.Quarter:
      return QuarterNoteIcon();
    case NoteLength.Eighth:
      return EighthNoteIcon();
    case NoteLength.Sixteenth:
      return SixteenthNoteIcon();
    default:
      return <>Error</>;
  }
}