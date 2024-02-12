"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";
import {
  KeyToNote,
  KeyToDuration,
  DurationToKey,
  NoteToKey,
} from "@/app/music";

/**
 * Listens for keyboard input and dispatches actions to the state
 * based on what key was pressed.
 * No other components should be listening for keyboard input.
 */
export default function KeyDispatcher() {
  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (state.keyboardLocked) return;
      
      // Dispatch that a key was pressed
      // and is currently being held down.
      dispatch({
        type: Message.KeyPress,
        payload: { key: event.key },
      });

      // Then, dispatch the appropriate action
      if (event.key === "Enter") {
        dispatch({ type: Message.Commit });
      } else if (isPianoKey(event.key)) {
        dispatch({
          type: Message.ToggleActiveNote,
          payload: { name: KeyToNote[event.key] },
        });
      } else if (isDurationKey(event.key)) {
        dispatch({
          type: Message.SetDuration,
          payload: { duration: KeyToDuration[event.key] },
        });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      dispatch({
        type: Message.KeyRelease,
        payload: { key: event.key },
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [state.keyboardLocked, dispatch]);

  return null;
}

function isPianoKey(key: string): boolean {
  return Object.values(NoteToKey).includes(key);
}

function isDurationKey(key: string): boolean {
  return Object.values(DurationToKey).includes(key);
}
