"use client";
import React, { useContext } from "react";
import { NoteName } from "@/app/state/music_theory";
import { StateContext } from "@/app/state/StateContext";

type PianoKeyProps = {
  noteName: NoteName;
};

export default function PianoKey({ noteName }: PianoKeyProps) {
  const { state } = useContext(StateContext)!;

  const x = xOffset(noteName);
  const y = 0;
  const w = isWhiteKey(noteName) ? 4 : 2;
  const h = isWhiteKey(noteName) ? 11 : 7;
  
  const isActive = state.activeNotes.includes(noteName);
  const highlightColor = "var(--color-highlight)";
  const keyColor = isWhiteKey(noteName) ? "white" : "black";
  const fill = isActive ? highlightColor : keyColor;
  
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={fill}
      stroke="var(--color-primary)"
      strokeWidth="0.125"
    />
  )
}

/**
 * Find the x offset of a piano key based on its note name.
 */
function xOffset(noteName: NoteName): number {
  const i = indexOf(noteName);
  if (i < 5) {
    if (isWhiteKey(noteName)) return 2 * i;
    else return 2 * i + 1;
  }
  else {
    if (isWhiteKey(noteName)) return 2 * i + 2;
    else return 2 * i + 3;
  }
}

/**
 * True if the NoteName is played with a white key
 * */
function isWhiteKey(noteName: NoteName): boolean {
  return noteName.length === 1;
}

function indexOf(noteName: NoteName): number {
  return Object.values(NoteName).indexOf(noteName);
}
