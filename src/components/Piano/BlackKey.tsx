"use client";
import { PianoKeyProps } from "./props";
import "./PianoKey.css";

export default function BlackKey({ noteName, active }: PianoKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "black",
    color: "white",
  };

  return (
    <div 
      className="piano-key black-key"
      style={keyStyle}
    >
      <p>{noteName}</p>
    </div>
  )
}