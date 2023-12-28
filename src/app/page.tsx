import { StateProvider } from "./state/StateContext";
import Piano from "@/components/Piano";
import NoteLengthControls from "@/components/NoteLengthControls";
import KeyDispatcher from "@/components/KeyDispatcher";
import History from "@/components/History";
import EnterIndicator from "@/components/EnterIndicator";

export default function Home() {
  return (
    <StateProvider>
      <KeyDispatcher />
      <div className="grid grid-cols-2 grid-rows-2 h-screen">
        <div className="py-20 px-32">
          <NoteLengthControls />
        </div>
        <div className="py-18 px-40 flex flex-col items-center justify-center">
          <Piano />
          <div className="w-full pt-4">
            <div className="flex justify-end">
              <EnterIndicator />
            </div>
          </div>
        </div>
        <div className="py-20 px-32 col-span-2">
          <History />
        </div>
      </div>
    </StateProvider>
  );
}
