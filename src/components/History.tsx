"use client";
import { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";
import NoteLengthIcon from "./icons/NoteLengthIcon";

/**
 * A visual representation of state.history,
 * a history of notes.
 */
export default function History() {
  const { state } = useContext(StateContext)!;

  return (
    <>
      <h1 className="text-2xl">History</h1>
      <div className="flex flex-wrap items-center gap-4">
        {state.history.map((e, i) => (
          <div
            key={i}
            className="border border-black p-2
                      flex items-center gap-2"
          >
            <NoteLengthIcon noteLength={e[0].length} />
            [{e.map((note) => note.name).join(", ")}]
          </div>
        ))}
      </div>
    </>
  );
}