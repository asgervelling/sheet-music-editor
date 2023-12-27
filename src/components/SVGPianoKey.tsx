"use client";
import React, { useContext, useEffect } from "react";
import { KeyToNote, NoteName, NoteToKey } from "@/lib/music_theory";
import { StateContext } from "@/app/context/StateContext";

const ACTIVE_COLOR = "#CE7B91";

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

  const fill = isActive ? ACTIVE_COLOR : "white";
  return (
    <g key={i} fill={fill}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke="var(--color-primary)"
        strokeWidth="0.125"
      />
    </g>
  )
};

export const BlackPianoKey = ({ i }: PianoKeyProps) => {
  // Use context
  const { state, dispatch } = useContext(StateContext)!;

  const noteNames: NoteName[] = Object.values(NoteName);
  const noteName = noteNames[i];
  const isActive = state.pressedKeys[NoteToKey[noteName]] || false;
  const x = i * 4 + 4.75;
  const y = 2;
  const w = 2.5;
  const h = 10;
  return (
    <g key={i} fill={isActive ? ACTIVE_COLOR : "black"}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={isActive ? ACTIVE_COLOR : "black"}
      />
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
      stroke="var(--color-primary)"
      strokeWidth="0.125"
    />
  )
}