import { Clef } from "@/app/music";

type ClefUnicodeProps = {
  clef: Clef;
};

export default function ClefUnicode({ clef }: ClefUnicodeProps) {
  return <>{unicode(clef)}</>;
}

function unicode(clef: Clef) {
  switch (clef) {
    case Clef.Treble:
    case Clef.French:
      return "𝄞";
    case Clef.BaritoneF:
    case Clef.Bass:
    case Clef.Subbass:
      return "𝄢";
    case Clef.BaritoneC:
    case Clef.Tenor:
    case Clef.Alto:
    case Clef.MezzoSoprano:
    case Clef.Soprano:
      return "𝄡";
    case Clef.Percussion:
    case Clef.Tab:
      return "";
  }
}
