"use client";
import React, { useEffect } from "react";
import { Key } from "ts-key-enum";
import PianoKey from "./PianoKey";
import { Note, NoteNames, NoteLength } from "@/lib/music_theory";

export default function Piano() {
  const onKeyPress = (event: KeyboardEvent) => {
    console.log(event);
    if (event.key === Key.Enter) {
      console.log("Enter");
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);

    // Clean-up
    return () => {
      document.removeEventListener("keyup", onKeyPress);
    };
  }, []); // Run only once

  const note: Note = {
    name: NoteNames.C,
    length: NoteLength.Quarter,
  }; 

  return (
    <div className="flex flex-row">
      <PianoKey name={NoteNames.C} />
      <PianoKey name={NoteNames.Db} />
    </div>
  );
}
