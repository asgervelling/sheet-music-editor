import { StateProvider } from "./context/StateContext";
import PianoSVG from "@/components/PianoSVG";

export default function Home() {
  return (
    <StateProvider>
      <main className="h-screen">
        <div className="h-1/2 grid grid-cols-2">
          <div className="bg-red-200">
            <p>a</p>
            <p>b</p>
            <p>c</p>
          </div>
          <div>
            <PianoSVG />
          </div>
        </div>
        <div className="h-1/2 grid grid-cols-2">
          <div className="bg-red-600">C</div>
          <div className="bg-red-800">D</div>
        </div>


        {/* <div className="bg-blue-300 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold">Sheet Music Editor</h1>
          <p className="text-2xl mt-4">
            Edit sheet music with a virtual keyboard
          </p>
        </div>
        <PianoSVG />

        <div className="bg-blue-700 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold">Try it with your keyboard</h1>
          <p className="text-2xl mt-4">
            ASDFGHJ for white keys, WE TYU for black keys.
            Make this second row only have one column, this one
          </p>
        </div> */}
      </main>
    </StateProvider>
  );
}
