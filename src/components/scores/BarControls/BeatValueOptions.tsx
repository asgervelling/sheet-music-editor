import { SelectItem } from "@/components/ui/select";
import { Duration } from "@/app/music";
import { asNumber } from "@/app/music/durations";

export function BeatValueOptions() {
  return (
    <>
      {Object.values(Duration).map((d) => (
        <SelectItem key={d} value={d}>
          {asNumber(d)}
        </SelectItem>
      ))}
    </>
  );
}
