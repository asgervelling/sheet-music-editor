"use client";
import { useContext, useEffect, useState } from "react";
import MultiKeyDispatcher from "./MultiKeyDispatcher";
import { StateContext } from "@/app/state/StateContext";
import { Message } from "@/app/state/messages";

export default function UndoIndicator() {
  const { dispatch } = useContext(StateContext)!;
  const [blinkTime, setBlinkTime] = useState(0);
  
  useEffect(() => {
    if (blinkTime > 0) {
      const interval = setInterval(() => {
        setBlinkTime(blinkTime - 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [dispatch, blinkTime]);

  const active = blinkTime > 0;

  const style = {
    backgroundColor: active ? "var(--color-primary)" : "var(--color-bg)",
    color: active ? "var(--color-bg)" : "var(--color-primary)",
  };

  return (
    <div>
      <MultiKeyDispatcher
        keyCombination={["Control", "z"]}
        onPress={() => {
          dispatch({ type: Message.UNDO});
          setBlinkTime(101);
        }}
      />
      <div
        className="transition-all duration-200 flex"
      >
        <div className="border border-[var(--color-primary)] p-2 select-none" style={style}>Ctrl</div>
        <div className="p-2 select-none">+</div>
        <div className="border border-[var(--color-primary)] p-2 select-none" style={style}>Z</div>
        <div className="ps-4 py-2 select-none">Undo</div>
      </div>
    </div>
  );
};