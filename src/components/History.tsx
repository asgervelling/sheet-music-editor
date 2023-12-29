"use client";
import { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import NoteLengthIcon from "./icons/NoteLengthIcon";
import { MusicalEvent } from "@/app/state/music_theory";

/**
 * A visual representation of state.history,
 * a history of notes.
 */
export default function History() {
  const { state } = useContext(StateContext)!;

  return (
    <>
      <h1>History</h1>
      <div className="flex flex-wrap items-center gap-4">
        {state.history.map((musicEvent: MusicalEvent, i) => (
          <div
            key={i}
            className="flex items-center
                       p-2
                       border border-[var(--color-primary)]"
          >
            <NoteLengthIcon noteLength={musicEvent[0].length} />
            [{musicEvent.map(note => note.name).join(", ")}]
            {/* <HistoryEntry musicEvent={musicEvent} /> */}
          </div>
        ))}
      </div>
    </>
  );
}
