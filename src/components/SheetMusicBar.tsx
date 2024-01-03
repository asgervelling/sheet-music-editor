"import client";
import { toStaveNote } from "@/app/sheet_music";
import { Bar } from "@/app/state/music_theory";
import { useEffect } from "react";
import { Formatter, StaveNote, Vex, Voice } from "vexflow";

const { Renderer, Stave } = Vex.Flow;

export default function SheetMusicBar({ timeSignature, events }: Bar) {
  useEffect(() => {
    // Create an SVG renderer and attach it to the DIV element named "output".
    const renderer = new Renderer("output", Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Create the notes
    const notes = events.map((e) => toStaveNote(e));
    
    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350);

    // Render voice
    voice.draw(context, stave);

    // Return a cleanup function
    return () => {
      // Remove the element from the DOM
      const div: HTMLElement | null = document.getElementById("output");
      if (div) {
        div.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      id="output"
    ></div>
  );
}