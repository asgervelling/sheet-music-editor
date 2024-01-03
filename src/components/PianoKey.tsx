"use client";
import React, { useContext } from "react";
import { NoteName, PianoKeys } from "@/app/state/music_theory";
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
  const letterColor = isActive
    ? "black"
    : isWhiteKey(noteName)
      ? "black"
      : "white";
  const keyboardShortcut = PianoKeys[noteName];

  const textAreaHeight = 2;
  const textAreaWidth = w;
  const textAreaX = x;
  const textAreaY = h - textAreaHeight;
  
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke="var(--color-primary)"
        strokeWidth="0.125"
      />
      <text
        x={textAreaX + textAreaWidth / 2}
        y={textAreaY + textAreaHeight / 2}
        stroke="none"
        fill={letterColor}
        dominantBaseline="middle"
        textAnchor="middle"
        fontWeight="100"
        fontSize="1"
        fontFamily="'Inter', sans-serif"
      >
        {keyboardShortcut.toUpperCase()}
      </text>
    </>
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
