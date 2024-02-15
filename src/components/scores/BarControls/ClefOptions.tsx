import { SelectItem } from "@/components/ui/select";

import { Clef } from "@/app/music";
import ClefUnicode from "@/components/icons/clefs/ClefUnicode";

export function ClefOptions() {
  return (
    <>
      {Object.values(Clef).map((c) => (
        <SelectItem key={c} value={c}>
          <div className="flex">
            <ClefUnicode clef={c} />
            <span className="pl-2 capitalize">{c}</span>
          </div>
        </SelectItem>
      ))}
    </>
  );
}