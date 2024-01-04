"use client";
import React, { useContext } from "react";
import { Note, NoteToKey } from "@/app/state/music";
import { StateContext } from "@/app/state/StateContext";

const WHITE_KEY_WIDTH = 4;
const BLACK_KEY_WIDTH = 2;
const WHITE_KEY_HEIGHT = 11;
const BLACK_KEY_HEIGHT = 7;
const HIGHLIGHT_COLOR = "var(--color-highlight)";

type PianoKeyProps = {
  duration: Note;
};

/**
 * A single piano key.
 * Can only be used within an SVG.
 */
export default function PianoKey({ duration }: PianoKeyProps) {
  const { state } = useContext(StateContext)!;

  const isActive = state.activeNotes.includes(duration);
  const { bgColor, textColor } = colors(duration, isActive);
  const keyboardShortcut = NoteToKey[duration];

  const { x, y, w, h } = dimensions(duration);
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
        stroke="var(--color-primary)"
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
function dimensions(duration: Note) {
  const x = xOffset(duration);
  const y = 0;
  if (isWhiteKey(duration)) {
    return { x, y, w: WHITE_KEY_WIDTH, h: WHITE_KEY_HEIGHT };
  }
  return { x, y, w: BLACK_KEY_WIDTH, h: BLACK_KEY_HEIGHT };
}

/**
 * Get the { bgColor, textColor }
 * of a piano key based on its note name
 * and whether it is active.
//  */
function colors(duration: Note, isActive: boolean) {
  const white = "white";
  const black = "black";
  const baseBgColor = isWhiteKey(duration) ? white : black;
  const baseTextColor = isWhiteKey(duration) ? black : white;
  const bgColor = isActive ? HIGHLIGHT_COLOR : baseBgColor;
  const textColor = isActive ? white : baseTextColor;
  return { bgColor, textColor };
}

/**
 * Find the x offset of a piano key based on its note name.
 */
function xOffset(duration: Note): number {
  const i = indexOf(duration);
  if (i < 5) {
    if (isWhiteKey(duration)) return 2 * i;
    else return 2 * i + 1;
  } else {
    if (isWhiteKey(duration)) return 2 * i + 2;
    else return 2 * i + 3;
  }
}

/**
 * True if the Note is played with a white key
 * */
function isWhiteKey(duration: Note): boolean {
  return duration.length === 1;
}

/**
 * Find the index of a note name in an octave.
 */
function indexOf(duration: Note): number {
  return Object.values(Note).indexOf(duration);
}
