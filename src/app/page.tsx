import { StateProvider } from "./context/StateContext";
import PianoSVG from "@/components/PianoSVG";

export default function Home() {
  return (
    <StateProvider>
        <div className="grid grid-cols-2 grid-rows-2 h-screen">
          {/* Row 1 */}
          <div className="bg-red-200">
            <p>a</p>
            <p>b</p>
            <p>c</p>
          </div>
          <div className="grid items-center py-20 px-32">
            <PianoSVG />
          </div>
          {/* Row 2 */}
          <div className="bg-red-800 col-span-2">C</div>
        </div>
    </StateProvider>
  );
}
