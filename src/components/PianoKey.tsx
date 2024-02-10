"use client";
import React, { useContext } from "react";
import { NoteName, NoteToKey } from "@/app/music";
import { StateContext } from "@/app/state/StateContext";

const WHITE_KEY_WIDTH = 4;
const BLACK_KEY_WIDTH = 2;
const WHITE_KEY_HEIGHT = 11;
const BLACK_KEY_HEIGHT = 7;
const HIGHLIGHT_COLOR = "hsl(var(--accent))";

type PianoKeyProps = {
  noteName: NoteName;
};

/**
 * A single piano key.
 * Can only be used within an SVG.
 */
export default function PianoKey({ noteName }: PianoKeyProps) {
  const { state } = useContext(StateContext)!;

  const isActive = state.activeNoteNames.includes(noteName);
  const { bgColor, textColor } = colors(noteName, isActive);
  const keyboardShortcut = NoteToKey[noteName];

  const { x, y, w, h } = dimensions(noteName);
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
        fill={bgColor}
        stroke="hsl(var(--primary))"
        strokeWidth="0.125"
      />
      <text
        x={textAreaX + textAreaWidth / 2}
        y={textAreaY + textAreaHeight / 2}
        stroke="none"
        fill={textColor}
        dominantBaseline="middle"
        textAnchor="middle"
        fontWeight="100"
        fontSize="1"
        fontFamily="'Inter', sans-serif"
      >
        {keyboardShortcut.toUpperCase()}
      </text>
    </>
  );
}

/**
 * Get the { x, y, w, h }
 * of a piano key based on its note name.
 */
function dimensions(noteName: NoteName) {
  const x = xOffset(noteName);
  const y = 0;
  if (isWhiteKey(noteName)) {
    return { x, y, w: WHITE_KEY_WIDTH, h: WHITE_KEY_HEIGHT };
  }
  return { x, y, w: BLACK_KEY_WIDTH, h: BLACK_KEY_HEIGHT };
}

/**
 * Get the { bgColor, textColor }
 * of a piano key based on its note name
 * and whether it is active.
*/
function colors(noteName: NoteName, isActive: boolean) {
  const white = "white";
  const black = "black";
  const baseBgColor = isWhiteKey(noteName) ? white : black;
  const baseTextColor = isWhiteKey(noteName) ? black : white;
  const bgColor = isActive ? HIGHLIGHT_COLOR : baseBgColor;
  const textColor = isActive ? white : baseTextColor;
  return { bgColor, textColor };
}

/**
 * Find the x offset of a piano key based on its note name.
 */
function xOffset(noteName: NoteName): number {
  const i = indexOf(noteName);
  if (i < 5) {
    if (isWhiteKey(noteName)) return 2 * i;
    else return 2 * i + 1;
  } else {
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

/**
 * Find the index of a note name in an octave.
 */
function indexOf(noteName: NoteName): number {
  return Object.values(NoteName).indexOf(noteName);
}
