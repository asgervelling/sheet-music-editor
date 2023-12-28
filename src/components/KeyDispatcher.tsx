"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";
import { KeyToNote, KeyToNoteLength, NoteLengthKeys, PianoKeys } from "@/app/state/music_theory";

/**
 * Listens for keyboard input and dispatches actions to the state
 * based on what key was pressed.
 * No other components should be listening for keyboard input.
 */
export default function KeyDispatcher() {
  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({
          type: Message.TOGGLE_PIANO_KEY,
          payload: { noteName: KeyToNote[event.key] },
        });
      }
      
      else if (isNoteLengthKey(event.key)) {
        dispatch({
          type: Message.SET_NOTE_LENGTH,
          payload: { noteLength: KeyToNoteLength[event.key] },
        });
      }

      else if (event.key === "Enter") {
        dispatch({ type: Message.COMMIT });
      }
      else {
        console.log("Unknown key pressed:", event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch]);

  return null;
}

function isPianoKey(key: string): boolean {
  return Object.values(PianoKeys).includes(key);
}

function isNoteLengthKey(key: string): boolean {
  return Object.values(NoteLengthKeys).includes(key);
}
