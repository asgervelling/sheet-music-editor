"import client";
import { toStaveNote } from "@/app/sheet_music";
import { Bar, parseTimeSignature } from "@/app/state/music";
import { useEffect } from "react"
import { Formatter, RenderContext, StaveNote, Vex, Voice } from "vexflow";

const { Renderer, Stave } = Vex.Flow;

const STAVE_WIDTH = 200
const STAVE_HEIGHT = 40;

/**
 * Create a rendering context with a canvas
 * that is full width and height of the element
 * identified by containerId. \
 * outputId is the element in which the renderer should render.
 */
function createRenderContext(containerId: string, outputId: string) {
  // Create an SVG renderer and attach it to the DIV element named "output".
  const renderer = new Renderer(outputId, Renderer.Backends.SVG);

  // Configure the rendering context.
  const parentDiv = document.getElementById(containerId);
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;
  const parentHeight = parentDiv ? parentDiv.offsetHeight : 200;

  // Set the size of the canvas
  renderer.resize(parentWidth, parentHeight);
  
  return renderer.getContext();
}

/**
 * Create a musical Stave,
 * a VexFlow type.
 */
function createStave(pos: number) {
  const stave = new Stave(pos, 40, STAVE_WIDTH);
  // stave.addClef("treble").addTimeSignature("4/4");
  return stave;
}

function displayError(e: any): void {
  const errorDiv = document.getElementById("error");
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}

export default function SheetMusicBar({ timeSignature, events, pos }: Bar & { pos: number }) {
  useEffect(() => {
    const context = createRenderContext("sheet-music-container", "output");

    const stave = createStave(pos);
    const notes = events.map(toStaveNote);
    
    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);


    try {
      // Format and justify the notes to fit the stave
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);

      // Draw
      stave.setContext(context).draw();
      voice.draw(context, stave);
    }
    catch (e) {
      displayError(e);
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

/**
 * Remove the innerHTML of the elements specified.
 */
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