import { useState } from "react";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Clef, Duration, NoteName, TimeSignature } from "@/app/music";

/**
 * A user interface for setting up a bar. \
 * That is, choosing a clef, a key signature
 * and a time signature.
 */
export default function BarControls() {
  const [clef, setClef] = useState(Clef.Treble);
  const [keySig, setKeySig] = useState(NoteName.C);
  const [timeSig, setTimeSig] = useState<TimeSignature>([4, Duration.Quarter]);
  

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Bar</h4>
        <p className="text-sm text-muted-foreground">Edit this bar.</p>
      </div>
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="width">Clef</Label>
          <DropdownMenu></DropdownMenu>
          <Input id="clef" defaultValue="Treble" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="height">Key</Label>
          <Input
            id="key"
            defaultValue={NoteName.C}
            className="col-span-2 h-8"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="maxWidth">Time Signature</Label>
          <Input
            id="timeSignature"
            defaultValue="4/4"
            className="col-span-2 h-8"
          />
        </div>
      </div>
    </div>
  );
}
