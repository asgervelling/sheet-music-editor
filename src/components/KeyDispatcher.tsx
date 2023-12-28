"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";
import { KeyToNoteLength, NoteLengthKeys, PianoKeys } from "@/app/state/music_theory";

/**
 * Listens for keyboard input and dispatches actions to the state
 * based on what key was pressed.
 * No other components should be listening for keyboard input.
 */
export default function KeyDispatcher() {
  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log("Handle key press", event.key);
      // const keyAlreadyHeld = state.heldPianoKeys[event.key] === true;
      if (isPianoKey(event.key)) {
        dispatch({
          type: Message.TOGGLE_PIANO_KEY,
          payload: { key: event.key },
        });
      }
      else if (isNoteLengthKey(event.key)) {
        dispatch({
          type: Message.SET_NOTE_LENGTH,
          payload: { noteLength: KeyToNoteLength[event.key] },
        });
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
