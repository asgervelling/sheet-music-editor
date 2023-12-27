import { Note } from "@/lib/music_theory";

type HistoryProps = {
  notes: Note[];
};

/**
 * Show what notes the user has played in a list
 */
export default function History({ notes }: HistoryProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl">History</h1>
      <p className="break-words">[{notes.map((note) => `(${note.name}, ${note.length})`)}]</p>
    </div>
  );
}