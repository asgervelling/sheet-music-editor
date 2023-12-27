import React from "react";
import SVGPianoKey, { WhitePianoKey, BlackPianoKey } from "./SVGPianoKey";


const PianoSVG = () => {
  const whiteHeight = 16;
  const blackHeight = 10;
  
  return (
    <div className="w-1/3 h-96">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 34">
        <g id="Keyboard">
          <g id="Octave" stroke="#111" strokeWidth="0.125">
            <g id="WhiteKeys">
              <WhitePianoKey i={0} />
              <WhitePianoKey i={1} />
              <WhitePianoKey i={2} />
              <WhitePianoKey i={3} />
              <WhitePianoKey i={4} />
              <WhitePianoKey i={5} />
              <WhitePianoKey i={6} />
            </g>

            <g id="BlackKeys">
              <BlackPianoKey i={0} />
              <BlackPianoKey i={1} />
              <BlackPianoKey i={3} />
              <BlackPianoKey i={4} />
              <BlackPianoKey i={5} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PianoSVG;
