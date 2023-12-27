"use client";
import React, { useContext, useEffect } from "react";
import { WhitePianoKey, BlackPianoKey } from "./SVGPianoKey";
import { StateContext } from "@/app/context/StateContext";
import { KeyToNote } from "@/lib/music_theory";


const PianoSVG = () => {
  const { state, dispatch } = useContext(StateContext)!;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({ type: 'KEY_PRESSED', payload: { key: event.key } });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (isPianoKey(event.key)) {
        dispatch({ type: 'KEY_RELEASED', payload: { key: event.key } });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [dispatch]);

  return (
    <>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
        <g id="Keyboard">
          <g id="Octave" stroke="#111" strokeWidth="0.125">
            <g id="WhiteKeys">
              {/* Fix bad code */}
              <WhitePianoKey i={0} />
              <WhitePianoKey i={2} />
              <WhitePianoKey i={4} />
              <WhitePianoKey i={5} />
              <WhitePianoKey i={7} />
              <WhitePianoKey i={9} />
              <WhitePianoKey i={11} />
            </g>
            <g id="BlackKeys">
              <BlackPianoKey i={1} />
              <BlackPianoKey i={3} />
              <BlackPianoKey i={6} />
              <BlackPianoKey i={8} />
              <BlackPianoKey i={10} />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

function isPianoKey(key: string): boolean {
  console.log("isPianoKey", key, ": ", Object.keys(KeyToNote).includes(key));
  return Object.keys(KeyToNote).includes(key);
}

export default PianoSVG;
