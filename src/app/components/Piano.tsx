"use client";
import React, { useEffect, useState } from "react";
import { Key } from "ts-key-enum";
import PianoKey from "./PianoKey";
import { Note, NoteNames, NoteLength, KeyMap } from "@/lib/music_theory";

export default function Piano() {
  const noteNames: NoteNames[] = Object.values(NoteNames);

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const onKeyDown = (event: KeyboardEvent) => {
    noteNames.forEach((name) => {
      if (event.key === KeyMap[name]) {
        setActiveKey(KeyMap[name]);
      }
    });    
  };

  const onKeyUp = () => {
    setActiveKey(null);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Clean-up
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [activeKey]);

  return (
    <div className="flex flex-row">
      {/* All 12 notes */}
      {noteNames.map((name, i) => (
        <PianoKey key={i} name={name} active={activeKey === KeyMap[name]} />
      ))}
    </div>
  );
}
