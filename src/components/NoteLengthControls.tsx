"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/context/StateContext";
import { MessageType } from "@/app/context/messages";
import NoteLengthKey from "./NoteLengthKey";
import { NoteLength } from "@/lib/music_theory";

export default function NoteLengthControls() {
  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const noteLengthFromKey = (key: string): NoteLength => {
      switch (key) {
        case "1":
          return NoteLength.Whole;
        case "2":
          return NoteLength.Half;
        case "3":
          return NoteLength.Quarter;
        case "4":
          return NoteLength.Eighth;
        case "5":
          return NoteLength.Sixteenth;
        case "6":
          return NoteLength.ThirtySecond; 
        default:
          throw new Error("Invalid key");
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (isNoteLengthKey(event.key)) {
        dispatch({
          type: MessageType.SET_NOTE_LENGTH,
          payload: { noteLength: noteLengthFromKey(event.key) },
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch]);

  return (
    <div className="grid grid-flow-col justify-start">
      <NoteLengthKey noteLength={NoteLength.Whole} />
      <NoteLengthKey noteLength={NoteLength.Half} />
      <NoteLengthKey noteLength={NoteLength.Quarter} />
      <NoteLengthKey noteLength={NoteLength.Eighth} />
      <NoteLengthKey noteLength={NoteLength.Sixteenth} />
      <NoteLengthKey noteLength={NoteLength.ThirtySecond} />
    </div>
  );
};

function isNoteLengthKey(key: string): boolean {
  return ["1", "2", "3", "4", "5", "6"].includes(key);
}