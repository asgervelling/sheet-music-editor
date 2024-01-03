"use client";
import React, { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Duration, NoteLengthKeys } from "@/app/state/music_theory";
import NoteLengthIcon from "../icons/NoteLengthIcon";

interface NoteLengthKeyProps {
  duration: Duration;
}

const NoteLengthIndicator: React.FC<NoteLengthKeyProps> = ({ duration }) => {
  const { state } = useContext(StateContext)!;
  const isCurrentNote = state.currNoteLength === duration;

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
        {NoteLengthKeys[duration]}
      </div>
      <NoteLengthIcon duration={duration} />
    </div>
  );
};

export default NoteLengthIndicator;
