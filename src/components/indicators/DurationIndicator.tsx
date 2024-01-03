"use client";
import React, { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Duration, DurationKeys } from "@/app/state/music_theory";
import DurationIcon from "../icons/DurationIcon";

interface DurationKeyProps {
  duration: Duration;
}

const DurationIndicator: React.FC<DurationKeyProps> = ({ duration }) => {
  const { state } = useContext(StateContext)!;
  const isCurrentNote = state.currDuration === duration;

  const style = {
    backgroundColor: isCurrentNote ? "var(--color-primary)" : "var(--color-bg)",
    color: isCurrentNote ? "var(--color-bg)" : "var(--color-primary)",
    border: isCurrentNote ? "none" : "1px solid var(--color-primary)",
  };

  return (
    <div>
      <div
        style={style}
        className="h-10 w-10 flex items-center justify-center mb-2"
      >
        {DurationKeys[duration]}
      </div>
      <DurationIcon duration={duration} />
    </div>
  );
};

export default DurationIndicator;
