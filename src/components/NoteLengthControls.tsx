import { useEffect, useState } from "react";
import ComputerKey from "./ComputerKey";
import { NoteLength } from "@/lib/music_theory";

export default function NoteLengthControls() {
  const [noteLength, setNoteLength] = useState<NoteLength>(NoteLength.Quarter);

  const onKeyDown = (event: KeyboardEvent) => {
    if (["1", "2", "3", "4", "5"].includes(event.key)) {
      setNoteLength(parseInt(event.key));
      console.log("Current note length: ", event.key);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    // Clean-up
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-row">
      {[1, 2, 3, 4, 5].map((key) => (
        <ComputerKey key={key} name={key.toString()} active={key === noteLength} />
      ))}
    </div>
  );
}
