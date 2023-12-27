import LayoutElement from "@/components/LayoutElement";
import { StateProvider } from "./context/StateContext";
import PianoSVG from "@/components/PianoSVG";

export default function Home() {
  return (
    <StateProvider>
      <div className="grid grid-cols-2 grid-rows-2 h-screen">
        {/* Row 1 */}
        <LayoutElement className="bg-blue-300">
          <p>a</p>
          <p>b</p>
          <p>c</p>
        </LayoutElement>
        <LayoutElement>
          <PianoSVG />
        </LayoutElement>
        {/* Row 2 */}
        <LayoutElement>C</LayoutElement>
      </div>
    </StateProvider>
  );
}
