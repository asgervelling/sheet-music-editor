"use client";
import { useContext } from "react";
import { StateContext } from "@/app/context/StateContext";
import NoteLengthIcon from "./icons/NoteLengthIcon";

/**
 * A visual representation of state.history,
 * a history of notes.
 */
export default function History() {
  const { state } = useContext(StateContext)!;

  return (
    <>
      <h1>History (Simple implementation: No chords)</h1>
      <div className="flex flex-wrap items-center gap-4">
        {state.history.map((note, i) => (
          <div
            key={i}
            className="flex items-center w-16 bg-red-300 pt-2 ps-2 justify-center rounded-md"
          >
            <span>{note.name}</span>
            <NoteLengthIcon noteLength={note.length} />
          </div>
        ))}
      </div>
    </>
  );
}