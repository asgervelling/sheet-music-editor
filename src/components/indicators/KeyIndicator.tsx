"use client";

import { StateContext } from "@/app/state/StateContext";
import { useContext } from "react";

type KeyIndicatorProps = {
  keyCode: string;
  label: string;
};

/**
 * Given a keyboard key and a label,
 * this component will display the label
 * like a keyboard button,
 * and light up when the key is pressed
 * on the user's actual keyboard.
 */
export default function KeyIndicator({ keyCode, label }: KeyIndicatorProps) {
  const { state } = useContext(StateContext)!;
  const isHighlighted = state.keysBeingHeld.includes(keyCode);
  
  const style = isHighlighted ? {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-bg)",
  } : {
    backgroundColor: "var(--color-bg)",
    color: "var(--color-primary)",
  };

  return (
    <>
      <div
        className="min-w-10 h-10 flex items-center p-2 justify-center
          border border-[var(--color-primary)] select-none"
        style={style}
      >
        {label}
      </div>
    </>
  );
}
