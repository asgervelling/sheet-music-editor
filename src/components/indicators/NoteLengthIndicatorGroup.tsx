import NoteLengthIndicator from "./NoteLengthIndicator";
import { Duration } from "@/app/state/music_theory";

export default function NoteLengthIndicatorGroup() {
  return (
    <div className="grid grid-flow-col justify-start gap-1">
      <NoteLengthIndicator duration={Duration.Whole} />
      <NoteLengthIndicator duration={Duration.Half} />
      <NoteLengthIndicator duration={Duration.Quarter} />
      <NoteLengthIndicator duration={Duration.Eighth} />
      <NoteLengthIndicator duration={Duration.Sixteenth} />
    </div>
  );
};