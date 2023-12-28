import { StateProvider } from "./context/StateContext";
import PianoSVG from "@/components/PianoSVG";
import NoteLengthControls from "@/components/NoteLengthControls";

export default function Home() {
  return (
    <StateProvider>
      <div className="grid grid-cols-2 grid-rows-2 h-screen">
        {/* Row 1 */}
        <div className="py-20 px-32">
          <NoteLengthControls />
          {/* <UndoRedoControls />
          <ArrowKeyControls /> */}
        </div>
        <div className="py-20 px-40 flex items-center justify-center">
          <PianoSVG />
        </div>
        {/* Row 2 */}
        <div className="py-20 px-32">C</div>
      </div>
    </StateProvider>
  );
}
