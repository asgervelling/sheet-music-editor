/**
 * @fileoverview
 * Our sheet music system are rendered with VexFlow,
 * a sheet music library.
 * Since it adds elements to the DOM as a side effect,
 * we will limit the number of re-renders by React
 * and let this component use VexFlow instead.
 */
"use client";
import { createTies, staveNote } from "@/app/sheet_music";
import { StateContext } from "@/app/state/StateContext";
import { Bar } from "@/app/state/music";
import { pair } from "@/app/state/music/arrays";
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import { NoteName } from "@/app/state/music/events";
import { Accidental, inferAccidentals } from "@/app/state/music/keys";
import { tsToString } from "@/app/state/music/time_signatures";
import { useContext, useEffect, useRef } from "react";
import * as VF from "vexflow";

const { Renderer } = VF.Vex.Flow;

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
}

/**
 * A system of staves. Will be rendered as sheet music.
 */
export default function SheetMusicSystem() {
  const { state } = useContext(StateContext)!;
  const containerRef = useRef(null);
  const renderContextRef = useRef<VF.RenderContext | null>(null);

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    try {
      const bars = createBars(state.history, [4, Duration.Quarter]); // HARDCODED time signature
      drawBars(context, bars);
    } catch (e) {
      displayError(e);
    }

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

function staveWidth(bar: Bar): number {
  const normal = 200;
  const notesPerStave = 6;
  const n = bar.events.length;
  return Math.max(normal, Math.ceil(n / notesPerStave) * normal);
}

function drawBar(
  context: VF.RenderContext,
  bar: Bar,
  i: number,
  offset: number
) {
  const notes = pair(bar.events).map(([a, b]) => {
    const sNote = staveNote(b);

    inferAccidentals(b, a, NoteName.C).forEach((ac, i) => {
      if (ac !== Accidental.Natural) {
        sNote.addModifier(new VF.Accidental(ac), i);
      }
    });
    return sNote;
  });

  const x = i + offset;
  const y = 0;
  const stave = new VF.Stave(x, y, staveWidth(bar));

  if (i === 0) {
    stave.addClef("treble").addTimeSignature(tsToString(bar.ts));
  }

  // Draw stave
  stave.setContext(context).draw();

  // Draw beams ♫
  const beams = VF.Beam.generateBeams(notes);
  VF.Formatter.FormatAndDraw(context, stave, notes);
  beams.forEach(function (b) {
    b.setContext(context).draw();
  });

  // Draw ties ♪‿♪
  const ties = createTies(bar, notes);
  ties.forEach((t) => {
    t.setContext(context).draw();
  });
}

function drawBars(context: VF.RenderContext, bars: Bar[]) {
  bars.forEach((bar, i) => {
    const offset = bars
      .slice(0, i)
      .map(staveWidth)
      .reduce((acc, n) => acc + n, 0);
    drawBar(context, bar, i, offset);
  });
}

/**
 * Create a VexFlow renderer and return its context.
 * @param containerId The ID of the container element.
 * @param outputId The ID of the output element.
 */
function createRenderContext(containerId: string, outputId: string) {
  const renderer = new Renderer(outputId, Renderer.Backends.SVG);
  const parentDiv = document.getElementById(containerId);
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;   // HARDCODED
  const parentHeight = parentDiv ? parentDiv.offsetHeight : 200; // HARDCODED
  renderer.resize(parentWidth, parentHeight);
  return renderer.getContext();
}

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}
