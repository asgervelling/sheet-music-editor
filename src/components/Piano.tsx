import { Note } from "@/app/state/music_theory";
import PianoKey from "./PianoKey";

const Piano = () => {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 11">
      <g id="Keyboard">
        <g id="Octave" stroke="#111" strokeWidth="0.125">
          <g id="WhiteKeys">
            <PianoKey noteName={Note.C} />
            <PianoKey noteName={Note.D} />
            <PianoKey noteName={Note.E} />
            <PianoKey noteName={Note.F} />
            <PianoKey noteName={Note.G} />
            <PianoKey noteName={Note.A} />
            <PianoKey noteName={Note.B} />
          </g>
          <g id="BlackKeys">
            <PianoKey noteName={Note.Db} />
            <PianoKey noteName={Note.Eb} />
            <PianoKey noteName={Note.Gb} />
            <PianoKey noteName={Note.Ab} />
            <PianoKey noteName={Note.Bb} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Piano;
