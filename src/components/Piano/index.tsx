"use client";
import React, { useEffect, useState } from "react";
import PianoKey from "./PianoKey";
import History from "../History";
import { Note, NoteNames, NoteLength, NoteToKey } from "@/lib/music_theory";
import NoteLengthControls from "../NoteLengthControls";

export default function Piano() {
  const noteNames: NoteNames[] = Object.values(NoteNames);

  const [currentLength, setCurrentLength] = useState<NoteLength>(
    NoteLength.Quarter
  );
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<Note[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    // Add if not already in activeKeys
    noteNames.forEach((name) => {
      if (event.key === NoteToKey[name] && !activeKeys.has(event.key)) {
        setActiveKeys((prevKeys) => new Set(prevKeys.add(event.key)));
        setHistory((prevHistory) => [
          ...prevHistory,
          {
            name: name,
            length: currentLength,
          },
        ]);
      }
    });
  };

  const onKeyUp = (event: KeyboardEvent) => {
    noteNames.forEach((name) => {
      if (event.key === NoteToKey[name]) {
        setActiveKeys((prevKeys) => {
          const newKeys = new Set(prevKeys);
          newKeys.delete(event.key);
          return newKeys;
        });
      }
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Clean-up
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [activeKeys, currentLength]);

  return (
    <div className="w-1/3">
      <div className="flex flex-row w-full h-full">
        {/* All 12 notes */}
        {noteNames.map((name, i) => (
          <PianoKey
            key={i}
            name={name}
            active={activeKeys.has(NoteToKey[name])}
          />
        ))}
      </div>
      <History notes={history} />
      <NoteLengthControls />
    </div>
  );
}
