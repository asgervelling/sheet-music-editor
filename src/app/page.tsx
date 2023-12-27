import KeyboardKey from "@/components/KeyboardKey"
import { StateProvider } from "./context/StateContext"
import PianoSVG from "@/components/PianoSVG"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <StateProvider>
        <PianoSVG />
        <KeyboardKey keyName="1" />
        <KeyboardKey keyName="2" />
      </StateProvider>
    </main>
  ) 
}
