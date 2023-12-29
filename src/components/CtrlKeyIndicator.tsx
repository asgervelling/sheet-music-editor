"use client";
import { useContext } from "react";
import { StateContext } from "@/app/state/StateContext";

/**
 * Indicator for whether the Ctrl key is held down.
 */
export default function CtrlKeyIndicator() {  
  const { state } = useContext(StateContext)!;

  const classNames = state.ctrlKeyHeld
    ? "bg-[var(--color-primary)] text-white"
    : "text-[var(--color-primary)]";
  return (
    <div
      className={`p-2 select-none
                 border border-[var(--color-primary)]
                 ${classNames}`}
    >
      Ctrl
    </div>
  );
}