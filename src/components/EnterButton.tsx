"use client";
import { useContext } from "react";

import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";

export default function EnterButton() {
  const { dispatch } = useContext(StateContext)!;

  return (
    <button
      onClick={() => dispatch({ type: Message.COMMIT })}
      className="flex items-center p-2 
                 border border-[var(--color-primary)]"
    >
      Enter
    </button>
  );
}
