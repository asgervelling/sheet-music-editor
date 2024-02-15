import { SelectItem } from "@/components/ui/select";

import { pitches } from "@/app/music/notes";

export function KeyOptions() {
  return (
    <>
      {pitches.map((n) => (
        <SelectItem key={n} value={n}>
          {n}
        </SelectItem>
      ))}
    </>
  );
}