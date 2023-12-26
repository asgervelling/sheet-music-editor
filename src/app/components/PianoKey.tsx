import { NoteNames } from "@/lib/music_theory"

function PianoKey({ name }: { name: string }) {
  return (
    <div className="w-10 h-40 bg-white border border-black rounded-md">
      <p>{name}</p>
    </div>
  )
}

export default PianoKey;