"use client";
import BlackKey from "./BlackKey";
import { PianoKeyProps } from "./props";
import WhiteKey from "./WhiteKey";

function PianoKey({ name, active }: PianoKeyProps) {
  return (
    <div className="w-[200px]">
      {name.length === 2 ? (
        <BlackKey name={name} active={active} />
      ) : (
        <WhiteKey name={name} active={active} />
      )}
    </div>
  );
}

export default PianoKey;
