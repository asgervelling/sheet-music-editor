"use client";
import { PianoKeyProps } from "./props";

export default function WhiteKey({ name, active }: PianoKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "white",
    color: active ? "white" : "var(--color-primary)",
  };

  return (
    <div 
      className="w-full h-40 p-1
                 flex flex-col justify-end items-center
                 border border-black rounded-md"
      style={keyStyle}
    >
      <p>{name}</p>
    </div>
  )
}