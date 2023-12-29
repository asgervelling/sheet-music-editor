"use client";
import { useContext, useEffect, useState } from "react";
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
  const [ctrlHeld, setCtrlHeld] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        dispatch({ type: Message.COMMIT });
      }
      else if (event.key === "z" && ctrlHeld) {
        dispatch({ type: Message.UNDO });
      }
      else if (event.key === "y" && ctrlHeld) {
        dispatch({ type: Message.REDO });
      }
      else if (isPianoKey(event.key)) {
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
    };

    const handleCtrlPress = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCtrlHeld(true);
      }
    }

    const handleCtrlRelease = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCtrlHeld(false);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleCtrlRelease);
    window.addEventListener("keydown", handleCtrlPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleCtrlRelease);
      window.removeEventListener("keydown", handleCtrlPress);
    };
  }, [dispatch, ctrlHeld]);

  return null;
}

function isPianoKey(key: string): boolean {
  return Object.values(PianoKeys).includes(key);
}

function isNoteLengthKey(key: string): boolean {
  return Object.values(NoteLengthKeys).includes(key);
}
