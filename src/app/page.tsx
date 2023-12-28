import { StateProvider } from "./context/StateContext";
import Piano from "@/components/Piano";
import NoteLengthControls from "@/components/NoteLengthControls";
import Staff from "@/components/Staff";
import KeyDispatcher from "@/components/KeyDispatcher";

export default function Home() {
  return (
    <StateProvider>
      <KeyDispatcher />
      <div className="grid grid-cols-2 grid-rows-2 h-screen">
        <div className="py-20 px-32">
          <NoteLengthControls />
        </div>
        <div className="py-20 px-40 flex items-center justify-center">
          <Piano />
        </div>
        <div className="py-20 px-32 col-span-2">
          <Staff />
        </div>
      </div>
    </StateProvider>
  );
}
