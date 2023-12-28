"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/context/StateContext";
import { MessageType } from "@/app/context/messages";
import { KeyToNoteLength, NoteLengthKeys, PianoKeys } from "@/lib/music_theory";

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
          type: MessageType.PIANO_KEY_PRESSED,
          payload: { key: event.key },
        });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({ 
          type: MessageType.PIANO_KEY_RELEASED,
          payload: { key: event.key }
        });
      }
      else if (isNoteLengthKey(event.key)) {
        dispatch({
          type: MessageType.SET_NOTE_LENGTH,
          payload: { noteLength: KeyToNoteLength[event.key] },
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [dispatch, state.heldPianoKeys]);

  return null;
}

function isPianoKey(key: string): boolean {
  return Object.values(PianoKeys).includes(key);
}

function isNoteLengthKey(key: string): boolean {
  return Object.values(NoteLengthKeys).includes(key);
}
