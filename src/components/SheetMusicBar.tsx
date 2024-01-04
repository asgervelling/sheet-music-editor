"import client";
import { toStaveNote } from "@/app/sheet_music";
import { Bar } from "@/app/state/music_theory";
import { useEffect } from "react";
import { Formatter, StaveNote, Vex, Voice } from "vexflow";

const { Renderer, Stave } = Vex.Flow;

// export default function SheetMusicBar({ timeSignature, events }: Bar) {
//   useEffect(() => {
//     const renderer = new Renderer("output", Renderer.Backends.SVG);

//     const parentDiv = document.getElementById("sheet-music-container");
//     const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;

//     const notes = events.map(toStaveNote);
//   });

//   return (
//     <div id="sheet-music-container" style={{ width: "100%" }}>
//       <div id="output"></div>
//     </div>
//   );
// }

export default function SheetMusicBar({ timeSignature, events }: Bar) {
  useEffect(() => {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const renderer = new Renderer("output", Renderer.Backends.SVG);

    // Configure the rendering context.
    const parentDiv = document.getElementById("sheet-music-container");
    const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;

    // Set the size of the canvas
    renderer.resize(parentWidth, 200);
    const context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new Stave(10, 40, 200);
    // stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    const notes = events.map(toStaveNote);

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    try {
      // Format and justify the notes to the adjusted width.
      const minWidth = 2 * new Formatter().preCalculateMinTotalWidth([voice]);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);

      // Render voice
      voice.draw(context, stave);
  
    }
    catch (e) {
      const errorDiv: HTMLElement | null = document.getElementById("error");
      if (errorDiv) {
        errorDiv.innerText = e.message;
      }
    }
    // Return a cleanup function
    return () => {
      // Remove the element from the DOM
      const div: HTMLElement | null = document.getElementById("output");
      if (div) {
        div.innerHTML = "";
      }
    };

  }, [events, timeSignature]);

  return (
    <div>
      <div id="error"></div>
      <div id="sheet-music-container" style={{ width: "100%" }}>
        <div id="output"></div>
      </div>
    </div>
  );
}

