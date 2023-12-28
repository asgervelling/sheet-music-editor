"use client";
import React, { useContext } from "react";
import { StateContext } from "@/app/context/StateContext";
import { NoteLength, NoteLengthKeys } from "@/lib/music_theory";
import NoteLengthIcon from "./NoteLengthIcon";

interface NoteLengthKeyProps {
  noteLength: NoteLength;
}

const NoteLengthIndicator: React.FC<NoteLengthKeyProps> = ({ noteLength }) => {
  const { state } = useContext(StateContext)!;
  const isCurrentNote = state.currNoteLength === noteLength;

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
        {NoteLengthKeys[noteLength]}
      </div>
      <NoteLengthIcon noteLength={noteLength} />
    </div>
  );
};

export default NoteLengthIndicator;
