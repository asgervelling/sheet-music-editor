/**
 * @fileoverview
 * Our sheet music system are rendered with VexFlow,
 * a sheet music library.
 * Since it adds elements to the DOM as a side effect,
 * we will limit the number of re-renders by React
 * and let this component use VexFlow instead.
 */
"use client";
import { toStaveNote } from "@/app/sheet_music";
import { StateContext } from "@/app/state/StateContext";
import { Bar, MusicalEvent } from "@/app/state/music";
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import { useContext, useEffect, useRef } from "react";
import { Formatter, RenderContext, Stave, Vex, Voice } from "vexflow";

const { Renderer } = Vex.Flow;

const STAVE_WIDTH = 200;
const STAVE_HEIGHT = 40;

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
}

/**
 * A system of staves. Will be rendered as sheet music.
 */
export default function SheetMusicSystem({ bars }: { bars: Bar[] }) {
  const { state } = useContext(StateContext)!;
  const containerRef = useRef(null);
  const renderContextRef = useRef<RenderContext | null>(null);

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    const bs: Bar[] = createBars(state.history, [4, Duration.Quarter]);

    // Draw bars
    bs.forEach((bar, i) => {
      const x = i * STAVE_WIDTH;
      const stave = createStave(bar.events, x);
      const voice = createVoice(bar.events);
      draw(context, stave, voice);
    })

    console.log(bs.length)

    return cleanUp;
  }, [containerRef.current, state.history]);

  /**
   * Remove child elements of output and error divs.
   */
  function cleanUp() {
    [DIV_ID.OUTPUT, DIV_ID.ERROR].forEach((id) => {
      const div: HTMLElement | null = document.getElementById(id);
      if (div) {
        div.innerHTML = "";
      }
    });
  }

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div id={DIV_ID.CONTAINER} ref={containerRef}>
        <div id={DIV_ID.OUTPUT}></div>
      </div>
    </div>
  );
}

/**
 * Create a VexFlow renderer and return its context.
 * @param containerId The ID of the container element.
 * @param outputId The ID of the output element.
 */
function createRenderContext(containerId: string, outputId: string) {
  const renderer = new Renderer(outputId, Renderer.Backends.SVG);
  const parentDiv = document.getElementById(containerId);
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;
  const parentHeight = parentDiv ? parentDiv.offsetHeight : 200;
  renderer.resize(parentWidth, parentHeight);
  return renderer.getContext();
}

function createStave(events: MusicalEvent[], x: number): Stave {
  const y = STAVE_HEIGHT;
  return new Stave(x, y, STAVE_WIDTH);
}

function createVoice(events: MusicalEvent[]): Voice {
  const notes = events.map(toStaveNote);
  const voice = new Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  return voice;
}

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}

function draw(context: RenderContext, stave: Stave, voice: Voice): void {
  try {
    new Formatter().joinVoices([voice]).formatToStave([voice], stave);
    stave.setContext(context).draw();
    voice.draw(context, stave);
  }
  catch (e) {
    displayError(e);
  }
}

