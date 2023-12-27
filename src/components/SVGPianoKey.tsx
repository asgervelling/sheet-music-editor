"use client";
import React, { useContext } from "react";
import { NoteName, NoteToKey } from "@/lib/music_theory";
import { StateContext } from "@/app/context/StateContext";

const ACTIVE_COLOR = "#CE7B91";

type PianoKeyProps = {
  i: number;
};

export const WhitePianoKey = ({ i }: PianoKeyProps) => {
  const mapping = (i: number) => {
    const codomain = [0, 2, 4, 5, 7, 9, 11];
    return codomain.indexOf(i);
  };
  const { state, dispatch } = useContext(StateContext)!;

  const noteNames: NoteName[] = Object.values(NoteName);
  const noteName = noteNames[i];
  const isActive = state.pressedKeys[NoteToKey[noteName]] || false;
  const x = mapping(i) * 4 + 2;
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
  );
};

export const BlackPianoKey = ({ i }: PianoKeyProps) => {
  const mapping = (i: number) => {
    const codomain = [1, 3, 6, 8, 10];
    return codomain.indexOf(i);
  };
  const { state, dispatch } = useContext(StateContext)!;

  const noteNames: NoteName[] = Object.values(NoteName);
  const noteName = noteNames[i];
  const isActive = state.pressedKeys[NoteToKey[noteName]] || false;
  const offset = mapping(i) < 2 ? 4.75 : 8.75;
  const x = mapping(i) * 4 + offset;
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
        z={1}
      />
    </g>
  );
};
