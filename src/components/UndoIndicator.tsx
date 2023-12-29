"use client";
import { useEffect, useState } from "react";
import MultiKeyDispatcher from "./MultiKeyDispatcher";

export default function UndoIndicator() {
  const [blinkTime, setBlinkTime] = useState(0);

  useEffect(() => {
    if (blinkTime > 0) {
      const interval = setInterval(() => {
        setBlinkTime(blinkTime - 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [blinkTime]);

  const active = blinkTime > 0;

  const style = {
    backgroundColor: active ? "var(--color-primary)" : "var(--color-bg)",
    color: active ? "var(--color-bg)" : "var(--color-primary)",
    border: active ? "none" : "1px solid var(--color-primary)",
  };

  return (
    <>
      <MultiKeyDispatcher
        keyCombination={["Control", "z"]}
        onPress={() => {
          console.log("Undo it");
          setBlinkTime(1);
        }}
      />
      <div
        style={style} 
        className="transition-all duration-100
          border border-[var(--color-primary)] p-2 select-none"
      >
        Undo
      </div>
    </>
  );
};