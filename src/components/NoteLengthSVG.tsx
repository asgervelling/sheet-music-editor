import { NoteLength } from "@/lib/music_theory"
import Image from "next/image";
import React from "react";
import { IconWholeNote } from "./icons/IconWholeNote";
import IconHalfNote from "./icons/IconHalfNote";
import IconQuarterNote from "./icons/IconQuarterNote";
import Icon8thNote from "./icons/Icon8thNote";
import Icon16thNote from "./icons/Icon16thNote";

type NoteLengthSVGProps = {
  noteLength: NoteLength;
};

export default function NoteLengthSVG({ noteLength }: NoteLengthSVGProps) {
  return (
    <div className="h-10 w-10 -translate-x-1">
      <Icon noteLength={noteLength} />
    </div>
  );
}

function Icon({ noteLength }: NoteLengthSVGProps) {
  switch (noteLength) {
    case NoteLength.Whole:
      return IconWholeNote();
    case NoteLength.Half:
      return IconHalfNote();
    case NoteLength.Quarter:
      return IconQuarterNote();
    case NoteLength.Eighth:
      return Icon8thNote();
    case NoteLength.Sixteenth:
      return Icon16thNote();
    default:
      return <>Error</>;
  }
}