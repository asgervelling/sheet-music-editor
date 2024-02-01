import { NoteName } from "@/app/state/music";
import PianoKey from "./PianoKey";

const Piano = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
      <g id="Keyboard">
        <g id="Octave" stroke="#111" strokeWidth="0.125">
          <g id="WhiteKeys">
            <PianoKey duration={NoteName.C} />
            <PianoKey duration={NoteName.D} />
            <PianoKey duration={NoteName.E} />
            <PianoKey duration={NoteName.F} />
            <PianoKey duration={NoteName.G} />
            <PianoKey duration={NoteName.A} />
            <PianoKey duration={NoteName.B} />
          </g>
          <g id="BlackKeys">
            <PianoKey duration={NoteName.Db} />
            <PianoKey duration={NoteName.Eb} />
            <PianoKey duration={NoteName.Gb} />
            <PianoKey duration={NoteName.Ab} />
            <PianoKey duration={NoteName.Bb} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Piano;
