import { NoteLength } from "@/lib/music_theory"

type NoteLengthSVGProps = {
  noteLength: NoteLength;
};

export default function NoteLengthSVG({ noteLength }: NoteLengthSVGProps) {
  return (
    <div className="h-10 w-10 text-center">
      {noteLength.toString()}
    </div>
  );
}