"use client";
import React, { useContext } from "react";
import { NoteName, PianoKeys } from "@/lib/music_theory";
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
  const isActive = state.heldPianoKeys[PianoKeys[noteName]] || false;
  const x = mapping(i) * 4 + 0;
  const y = 0;
  const w = 4;
  const h = 11;

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
  const isActive = state.heldPianoKeys[PianoKeys[noteName]] || false;
  const offset = mapping(i) < 2 ? 3 : 7;
  const x = mapping(i) * 4 + offset;
  const y = 0;
  const w = 2;
  const h = 7;

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
