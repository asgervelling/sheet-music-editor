import { Duration } from "@/app/state/music_theory"
import React from "react";
import { WholeNoteIcon } from "./WholeNoteIcon";
import HalfNoteIcon from "./HalfNoteIcon";
import QuarterNoteIcon from "./QuarterNoteIcon";
import EighthNoteIcon from "./EighthNoteIcon";
import SixteenthNoteIcon from "./SixteenthNoteIcon";

type NoteLengthSVGProps = {
  duration: Duration;
};

export default function NoteLengthIcon({ duration }: NoteLengthSVGProps) {
  return (
    <div className="h-10 w-10 -translate-x-1">
      <Icon duration={duration} />
    </div>
  );
}

function Icon({ duration }: NoteLengthSVGProps) {
  switch (duration) {
    case Duration.Whole:
      return WholeNoteIcon();
    case Duration.Half:
      return HalfNoteIcon();
    case Duration.Quarter:
      return QuarterNoteIcon();
    case Duration.Eighth:
      return EighthNoteIcon();
    case Duration.Sixteenth:
      return SixteenthNoteIcon();
    default:
      console.error("Unknown note length:", duration);
      return <>Error</>;
  }
}