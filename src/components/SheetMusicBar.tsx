import { toStaveNote } from "@/app/sheet_music";
import { Bar } from "@/app/state/music_theory";

export default function SheetMusicBar({ timeSignature, events }: Bar) {
  for (const event of events) {
    const staveNote = toStaveNote(event);
    console.log(event, staveNote);
  }

  return <></>;
}