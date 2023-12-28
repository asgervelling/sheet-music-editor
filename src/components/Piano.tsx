"use client";
import { WhitePianoKey, BlackPianoKey } from "./SVGPianoKey";

const Piano = () => {
  return (
    <>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
        <g id="Keyboard">
          <g id="Octave" stroke="#111" strokeWidth="0.125">
            <g id="WhiteKeys">
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

export default Piano;
