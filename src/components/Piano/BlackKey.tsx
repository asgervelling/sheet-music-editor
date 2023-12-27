"use client";
import { PianoKeyProps } from "./props";

export default function BlackKey({ noteName, active }: PianoKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "black",
    color: "white",
  };

  return (
    <div 
      className="w-full h-28 p-1
                 flex flex-col justify-end items-center
                 border border-black rounded-md"
      style={keyStyle}
    >
      <p>{noteName}</p>
    </div>
  )
}