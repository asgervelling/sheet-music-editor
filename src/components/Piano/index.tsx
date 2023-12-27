"use client";
import React, { useContext, useEffect } from "react";
import PianoKey from "./PianoKey";
import { KeyToNote, NoteName, NoteToKey } from "@/lib/music_theory";
import { StateContext } from "@/app/context/StateContext";

export default function Piano() {
  const noteNames: NoteName[] = Object.values(NoteName);

  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({ type: 'KEY_PRESSED', payload: { key: event.key } });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({ type: 'KEY_RELEASED', payload: { key: event.key } });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [dispatch]);

  return (
    <div className="w-1/3">
      <div className="flex flex-row w-full h-full">
        {noteNames.map((noteName, i) => {
          const active = state.pressedKeys[NoteToKey[noteName]] || false;
          return <PianoKey key={i} noteName={noteName} active={active} />;
        })}
      </div>
    </div>
  );
}

function isPianoKey(key: string): boolean {
  return Object.keys(KeyToNote).includes(key);
}