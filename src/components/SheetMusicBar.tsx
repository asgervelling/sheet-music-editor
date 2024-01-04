"import client";
import { toStaveNote } from "@/app/sheet_music";
import { Bar, parseTimeSignature } from "@/app/state/music";
import { useEffect } from "react"
import { Formatter, StaveNote, Vex, Voice } from "vexflow";

const { Renderer, Stave } = Vex.Flow;

export default function SheetMusicBar({ timeSignature, events, pos }: Bar & { pos: number }) {
  useEffect(() => {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const renderer = new Renderer("output", Renderer.Backends.SVG);

    // Configure the rendering context.
    const parentDiv = document.getElementById("sheet-music-container");
    const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;

    // Set the size of the canvas
    renderer.resize(parentWidth, 200);
    const context = renderer.getContext();

    // Create a stave at position (0, 40) of width 200 on the canvas.
    const stave = new Stave(pos, 40, 200);
    // stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    const notes = events.map(toStaveNote);

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    try {
      // Format and justify the notes to the adjusted width.
      // const minWidth = 2 * new Formatter().preCalculateMinTotalWidth([voice]);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);

      // Render voice
      voice.draw(context, stave);

      // Delete me: Trying to add a second stave
      const stave2 = new Stave(pos + 200, 40, 200);
      stave2.setContext(context).draw();

      // const voice2 = new Voice({ num_beats: 4, beat_value: 4 });
      // voice2.addTickables(notes);
      // new Formatter().joinVoices([voice2]).formatToStave([voice2], stave2);
      // voice2.draw(context, stave2);

    }
    catch (e) {
      const errorDiv: HTMLElement | null = document.getElementById("error");
      if (errorDiv) {
        errorDiv.innerHTML = e.message;
      }
    }
    
    // Return a cleanup function for useEffect to call when the component is unmounted
    return createCleanupFn(["output", "error"]);
  }, [events, timeSignature]);

  return (
    <div>
      <div id="error"></div>
      <div id="sheet-music-container">
        <div id="output"></div>
      </div>
    </div>
  );
}

function createCleanupFn(elementIds: string[]): () => void {
  return () => {
    elementIds.forEach((id) => {
      const div: HTMLElement | null = document.getElementById(id);
      if (div) {
        div.innerHTML = "";
      }
    });
  }
}