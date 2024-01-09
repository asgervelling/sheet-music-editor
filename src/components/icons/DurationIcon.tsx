import React from "react";

import { Duration } from "@/app/state/music"
import WholeNoteIcon from "./WholeNoteIcon";
import HalfNoteIcon from "./HalfNoteIcon";
import QuarterNoteIcon from "./QuarterNoteIcon";
import EighthNoteIcon from "./EighthNoteIcon";
import SixteenthNoteIcon from "./SixteenthNoteIcon";

type DurationSVGProps = {
  duration: Duration;
};

export default function DurationIcon({ duration }: DurationSVGProps) {
  return (
    <div className="h-10 w-10 -translate-x-1">
      <Icon duration={duration} />
    </div>
  );
}

function Icon({ duration }: DurationSVGProps) {
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
  }
}