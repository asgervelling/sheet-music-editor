import { NoteName } from "@/app/state/music_theory";
import PianoKey from "./PianoKey";

const Piano = () => {
  return (
    <>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
        <g id="Keyboard">
          <g id="Octave" stroke="#111" strokeWidth="0.125">
            <g id="WhiteKeys">
              <PianoKey noteName={NoteName.C} />
              <PianoKey noteName={NoteName.D} />
              <PianoKey noteName={NoteName.E} />
              <PianoKey noteName={NoteName.F} />
              <PianoKey noteName={NoteName.G} />
              <PianoKey noteName={NoteName.A} />
              <PianoKey noteName={NoteName.B} />
            </g>
            <g id="BlackKeys">
              <PianoKey noteName={NoteName.Db} />
              <PianoKey noteName={NoteName.Eb} />
              <PianoKey noteName={NoteName.Gb} />
              <PianoKey noteName={NoteName.Ab} />
              <PianoKey noteName={NoteName.Bb} />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export default Piano;
