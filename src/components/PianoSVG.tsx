import React from "react";
import SVGPianoKey, { WhitePianoKey } from "./SVGPianoKey";


const PianoSVG = () => {
  const whiteHeight = 16;
  const blackHeight = 10;
  
  return (
    <div className="w-1/3 h-96">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 34">
        <g id="Keyboard">
          <g id="Octave" stroke="#111" strokeWidth="0.125">
            <g id="WhiteKeys" fill="#eee">
              <WhitePianoKey i={0} />
              <WhitePianoKey i={1} />
              <WhitePianoKey i={2} />
              <WhitePianoKey i={3} />
              {/* <SVGPianoKey x={2} y={2} width={4} height={whiteHeight} />
              <SVGPianoKey x={6} y={2} width={4} height={whiteHeight} />
              <SVGPianoKey x={10} y={2} width={4} height={whiteHeight} />
              <SVGPianoKey x={14} y={2} width={4} height={whiteHeight} /> */}
              <SVGPianoKey x={18} y={2} width={4} height={whiteHeight} />
              <SVGPianoKey x={22} y={2} width={4} height={whiteHeight} />
              <SVGPianoKey x={26} y={2} width={4} height={whiteHeight} />
            </g>

            <g id="BlackKeys" fill="#000">
              <SVGPianoKey x={4.75} y={2} width={2.5} height={blackHeight} />
              <SVGPianoKey x={8.75} y={2} width={2.5} height={blackHeight} />
              <SVGPianoKey x={16.75} y={2} width={2.5} height={blackHeight} />
              <SVGPianoKey x={20.75} y={2} width={2.5} height={blackHeight} />
              <SVGPianoKey x={24.75} y={2} width={2.5} height={blackHeight} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PianoSVG;
