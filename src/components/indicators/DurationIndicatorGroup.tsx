import DurationIndicator from "./DurationIndicator";
import { Duration } from "@/app/state/music";

export default function DurationIndicatorGroup() {
  return (
    <div className="grid grid-flow-col justify-start gap-1">
      <DurationIndicator duration={Duration.Whole} />
      <DurationIndicator duration={Duration.Half} />
      <DurationIndicator duration={Duration.Quarter} />
      <DurationIndicator duration={Duration.Eighth} />
      <DurationIndicator duration={Duration.Sixteenth} />
    </div>
  );
};