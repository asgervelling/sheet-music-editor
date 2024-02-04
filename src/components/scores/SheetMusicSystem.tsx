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
import { head, last, pair, tail } from "@/app/state/music/arrays";
import { createBars } from "@/app/state/music/bars";
import { Duration, expandDuration } from "@/app/state/music/durations";
import { MusicalEvent, NoteName, simplify } from "@/app/state/music/events";
import {
  Accidental,
  applyAccidentals,
  inferAccidentals,
} from "@/app/state/music/keys";
import { fmtChunk, fmtChunks, fmtEvent } from "@/app/state/music/test_helpers";
import {
  beatValue,
  tsTo32nds,
  tsToString,
} from "@/app/state/music/time_signatures";
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

function fmtBars(bars: Bar[]) {
  return fmtChunks(bars.map((b) => b.events));
}

function fmtNotes(notes: VF.StaveNote[]) {
  return (
    "[" +
    notes.map((n) => `(${n.getKeys()}, ${n.getDuration()})`).join(", ") +
    "]"
  );
}

function drawBar(
  context: VF.RenderContext,
  bar: Bar,
  i: number,
  offset: number
) {
  // const notes = pair(bar.events).map(([a, b], i) => {
  //   const sNote = staveNote(b);

  //   inferAccidentals(b, a, NoteName.C).forEach((ac, i) => {
  //     if (ac !== Accidental.Natural) {
  //       sNote.addModifier(new VF.Accidental(ac), i);
  //     }
  //   });
  //   return sNote;
  // });

  const notes = applyAccidentals(bar.events, null, NoteName.C); // HARDCODED key

  // console.log(`${fmtBars([bar])} ->\n${fmtNotes(notes)}`);
  // const ifso = (e: MusicalEvent | null) => (e ? fmtEvent(e) : "null");
  // console.log("Pairs:", "[" + pair([null, ...bar.events]).map(([a, b]) => {
  //   return `(${ifso(a)}, ${ifso(b)})`;
  // }).join(", ") + "]");

  const x = offset;
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
  if (bars.length === 0) {
    return [];
  }

  // const notess = tail(bars).map((bar, i) => {
  //   const previous = last(bars[i - 1].events) ?? null;
  //   // HARDCODED key
  //   return applyAccidentals(bar.events, previous, NoteName.C)
  // });

  // const notesInFirstBar = tail(head(bars).events).map((e, i) => {
  //   return applyAccidentals(e)
  // })

  let previous: MusicalEvent | null = null;
  bars.forEach((bar, i) => {
    const offset = bars
      .slice(0, i)
      .map(staveWidth)
      .reduce((acc, n) => acc + n, 0);
    // drawBar(context, bar, i, offset);
    
    const notes = applyAccidentals(bar.events, previous, NoteName.C); // HARDCODED key
    console.log(
      "Notes:",
      "[" + notes.map((n) => `(${n.getKeys()}, ${n.getDuration()})`) + "]"
    );
    console.log("Previous:", previous ? fmtEvent(previous) : "null");
    console.log("Bar:", fmtBars([bar]), "last:", fmtEvent(last(bar.events)))
    console.log();
    
    previous = last(bar.events) ? last(bar.events) : null;

    const x = offset;
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
