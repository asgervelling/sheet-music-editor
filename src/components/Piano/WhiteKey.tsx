"use client";
import { PianoKeyProps } from "./props";
import "./PianoKey.css";

export default function WhiteKey({ noteName, active }: PianoKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "white",
    color: active ? "white" : "var(--color-primary)",
  };

  return (
    <div 
      className="piano-key white-key"
      style={keyStyle}
    >
      <p>{noteName}</p>
    </div>
  )
}