"use client";
import { useContext, useEffect } from "react";
import { StateContext } from "@/app/context/StateContext";
import BlackKey from "./BlackKey";
import WhiteKey from "./WhiteKey";

type PianoKeyProps = {
  keyName: string;
  active: boolean;
};

function PianoKey({ keyName, active }: PianoKeyProps) {
  return (
    <div className="w-[200px]">
      {keyName.length === 2 ? (
        <BlackKey name={keyName} active={active} />
      ) : (
        <WhiteKey name={keyName} active={active} />
      )}
    </div>
  );
}

export default PianoKey;
