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
  const { dispatch } = useContext(StateContext)!;

  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // First, dispatch that a key was pressed
      // and is currently being held down.
      dispatch({
        type: Message.KEY_PRESS,
        payload: { key: event.key },
      });

      // Then, dispatch the appropriate action
      if (event.key === "Enter") {
        dispatch({ type: Message.COMMIT });
      }
      else if (isPianoKey(event.key)) {
        dispatch({
          type: Message.TOGGLE_ACTIVE_NOTE,
          payload: { noteName: KeyToNote[event.key] },
        });
      }
      else if (isNoteLengthKey(event.key)) {
        dispatch({
          type: Message.SET_NOTE_LENGTH,
          payload: { noteLength: KeyToNoteLength[event.key] },
        });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      dispatch({
        type: Message.KEY_RELEASE,
        payload: { key: event.key },
      });
    }

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
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
