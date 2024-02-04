/**
 * @fileoverview
 * Our sheet music system are rendered with VexFlow,
 * a sheet music library.
 * Since it adds elements to the DOM as a side effect,
 * we will limit the number of re-renders by React
 * and let this component use VexFlow instead.
 */
"use client";
import { createTies } from "@/app/sheet_music";
import { StateContext } from "@/app/state/StateContext";
import { Bar } from "@/app/state/music";
import { last } from "@/app/state/music/arrays";
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import {
  MusicalEvent,
  NoteName,
} from "@/app/state/music/events";
import {
  applyAccidentals,
} from "@/app/state/music/keys";
import {
  tsToString,
} from "@/app/state/music/time_signatures";
import { useContext, useEffect, useRef } from "react";
import * as VF from "vexflow";

/**
 * This type bridges the gap between our own music theory \
 * code and the VexFlow sheet music rendering library.
 * It represents a Bar as something that can easily be drawn \
 * on the screen.
 */
type SheetMusicBar = {
  key: NoteName;
  stave: VF.Stave;
  notes: VF.StaveNote[];
  beams: VF.Beam[];
  ties: VF.StaveTie[];
};

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
      // drawBars(context, bars);
      drawSMBars(context, createSheetMusicBars(bars));
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

function createSheetMusicBars(bars: Bar[]): SheetMusicBar[] {
  if (bars.length === 0) return [];

  let previous: MusicalEvent | null = null;
  return bars.map((bar, i): SheetMusicBar => {
    const key = NoteName.C; // HARDCODED key
    const stave = createStave(bars, i);
    const notes = applyAccidentals(bar.events, previous, key);
    previous = last(bar.events) ? last(bar.events) : null;
    const beams = VF.Beam.generateBeams(notes);
    const ties = createTies(bar, notes);

    return { key, stave, notes, beams, ties };
  });
}

function createStave(bars: Bar[], i: number): VF.Stave {
  const x = bars
    .slice(0, i)
    .map(staveWidth)
    .reduce((acc, n) => acc + n, 0);
  const y = 0;
  const stave = new VF.Stave(x, y, staveWidth(bars[i]));
  if (i === 0) {
    // HARDCODED clef
    stave.addClef("treble").addTimeSignature(tsToString(bars[i].ts));
  }
  return stave;
}

function staveWidth(bar: Bar): number {
  const normal = 200;
  const notesPerStave = 6;
  const n = bar.events.length;
  return Math.max(normal, Math.ceil(n / notesPerStave) * normal);
}

function drawSMBars(context: VF.RenderContext, bars: SheetMusicBar[]) {
  bars.forEach((bar) => {
    // Draw stave
    bar.stave.setContext(context).draw();

    // Draw notes
    VF.Formatter.FormatAndDraw(context, bar.stave, bar.notes);

    // Draw beams ♫
    bar.beams.forEach((b) => b.setContext(context).draw());

    // Draw ties ♪‿♪
    bar.ties.forEach((t) => t.setContext(context).draw());
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
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500; // HARDCODED
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
