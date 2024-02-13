"use client";
import React, { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Duration, DurationToKey } from "@/app/music";
import { DurationIcon } from "../icons";

interface DurationKeyProps {
  duration: Duration;
}

const DurationIndicator: React.FC<DurationKeyProps> = ({ duration }) => {
  const { state } = useContext(StateContext)!;
  const isCurrentNote = state.currDuration === duration;

  const style = {
    backgroundColor: isCurrentNote ? "hsl(var(--primary))" : "hsl(var(--background))",
    color: isCurrentNote ? "hsl(var(--background))" : "hsl(var(--primary))",
    border: isCurrentNote ? "none" : "1px solid hsl(var(--primary))",
  };

  return (
    <div>
      <div
        style={style}
        className="h-10 w-10 flex items-center justify-center mb-2 select-none"
      >
        {DurationToKey[duration]}
      </div>
      <DurationIcon duration={duration} />
    </div>
  );
};

export default DurationIndicator;
