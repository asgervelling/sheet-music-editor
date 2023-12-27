"use client";
import React, { useContext, useEffect } from "react";
import PianoKey from "./PianoKey";
import { NoteName } from "@/lib/music_theory";
import { StateContext } from "@/app/context/StateContext";

export default function Piano() {
  const noteNames: string[] = Object.values(NoteName).map(s => s.toString());

  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (noteNames.includes(event.key)) {
        dispatch({ type: 'KEY_PRESSED', payload: { key: event.key } });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (noteNames.includes(event.key)) {
        dispatch({ type: 'KEY_RELEASED', payload: { key: event.key } });
      }
    };

    console.log('Piano: useEffect')

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
          const active = state.pressedKeys[noteName] || false;
          return <PianoKey key={i} keyName={noteName} active={active} />;
        })}
      </div>
    </div>
  );
}