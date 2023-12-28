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
            className="flex items-center justify-center w-16
                       pt-2 ps-2 rounded-md
                       border border-[var(--color-primary)]"
          >
            <span>{note.name}</span>
            <NoteLengthIcon noteLength={note.length} />
          </div>
        ))}
      </div>
    </>
  );
}