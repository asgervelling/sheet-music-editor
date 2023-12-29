"use client";
import React, { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import { NoteLength, NoteLengthKeys } from "@/app/state/music_theory";
import NoteLengthIcon from "./icons/NoteLengthIcon";

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
    <div className="border border-green-500">
      <div>
        <div
          style={style}
          className="h-10 w-10 flex items-center justify-center mb-2"
        >
          {NoteLengthKeys[noteLength]}
        </div>
        <NoteLengthIcon noteLength={noteLength} />
      </div>
    </div>
  );
};

export default NoteLengthIndicator;
