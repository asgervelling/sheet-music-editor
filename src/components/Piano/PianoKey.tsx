"use client";
import React from "react";
import BlackKey from "./BlackKey";
import WhiteKey from "./WhiteKey";
import { PianoKeyProps } from "./props";
import "./PianoKey.css";

function PianoKey({ noteName, active }: PianoKeyProps) {
  return (
    <div className="w-full flex justify-center items-start">
      {noteName.length === 2 ? (
        <BlackKey noteName={noteName} active={active} />
      ) : (
        <WhiteKey noteName={noteName} active={active} />
      )}
    </div>
  );
}

export default PianoKey;
