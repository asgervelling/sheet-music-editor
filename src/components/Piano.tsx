import { Note } from "@/app/state/music_theory";
import PianoKey from "./PianoKey";

const Piano = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
      <g id="Keyboard">
        <g id="Octave" stroke="#111" strokeWidth="0.125">
          <g id="WhiteKeys">
            <PianoKey duration={Note.C} />
            <PianoKey duration={Note.D} />
            <PianoKey duration={Note.E} />
            <PianoKey duration={Note.F} />
            <PianoKey duration={Note.G} />
            <PianoKey duration={Note.A} />
            <PianoKey duration={Note.B} />
          </g>
          <g id="BlackKeys">
            <PianoKey duration={Note.Db} />
            <PianoKey duration={Note.Eb} />
            <PianoKey duration={Note.Gb} />
            <PianoKey duration={Note.Ab} />
            <PianoKey duration={Note.Bb} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Piano;
