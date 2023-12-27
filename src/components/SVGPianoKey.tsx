"use client";
import React, { useContext, useEffect } from "react";
import { KeyToNote, NoteName, NoteToKey } from "@/lib/music_theory";
import { StateContext } from "@/app/context/StateContext";

type PianoKeyProps = {
  i: number;
};

export const WhitePianoKey = ({ i }: PianoKeyProps) => {
  // Use context
  const { state, dispatch } = useContext(StateContext)!;

  const noteNames: NoteName[] = Object.values(NoteName);
  const noteName = noteNames[i];
  const isActive = state.pressedKeys[NoteToKey[noteName]] || false;
  const x = i * 4 + 2;
  const y = 2;
  const w = 4;
  const h = 16;
  return (
    <g key={i} fill={isActive ? "#CE7B91" : "white"}>
      <SVGPianoKey x={x} y={y} width={w} height={h} />
    </g>
  )
};

type SVGPianoKeyProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function SVGPianoKey({ x, y, width, height }: SVGPianoKeyProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="#111"
      strokeWidth="0.125"
    />
  )
}