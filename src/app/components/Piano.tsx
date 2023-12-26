"use client";
import React, { useEffect, useState } from "react";
import { Key } from "ts-key-enum";
import PianoKey from "./PianoKey";
import { Note, NoteNames, NoteLength, KeyMap } from "@/lib/music_theory";

export default function Piano() {
  const noteNames: NoteNames[] = Object.values(NoteNames);

  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    // Add if not already in activeKeys
    noteNames.forEach((name) => {
      if (event.key === KeyMap[name] && !activeKeys.includes(event.key)) {
        setActiveKeys([...activeKeys, event.key]);
      }
    });    
  };

  const onKeyUp = (event: KeyboardEvent) => {
    noteNames.forEach((name) => {
      if (event.key === KeyMap[name]) {
        setActiveKeys(activeKeys.filter((key) => key !== KeyMap[name]));
      }
    });
  }

  useEffect(() => {
    console.log(activeKeys);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Clean-up
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [activeKeys]);

  return (
    <div className="flex flex-row">
      {/* All 12 notes */}
      {noteNames.map((name, i) => (
        <PianoKey key={i} name={name} active={activeKeys.includes(KeyMap[name])} />
      ))}
    </div>
  );
}
