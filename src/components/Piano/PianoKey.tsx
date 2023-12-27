"use client";
import BlackKey from "./BlackKey";
import WhiteKey from "./WhiteKey";
import { PianoKeyProps } from "./props";


function PianoKey({ noteName, active }: PianoKeyProps) {
  return (
    <div className="w-[200px]">
      {noteName.length === 2 ? (
        <BlackKey noteName={noteName} active={active} />
      ) : (
        <WhiteKey noteName={noteName} active={active} />
      )}
    </div>
  );
}

export default PianoKey;
