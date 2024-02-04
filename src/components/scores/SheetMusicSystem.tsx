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
import { mapPairs } from "@/app/state/music/arrays";
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import { MusicalEvent, NoteName } from "@/app/state/music/events";
import { inferAccidentals } from "@/app/state/music/keys";
import { fmtChunk } from "@/app/state/music/test_helpers";
import { tsToString } from "@/app/state/music/time_signatures";
import { useContext, useEffect, useRef } from "react";
import {
  Accidental,
  Beam,
  Formatter,
  RenderContext,
  Stave,
  StaveNote,
  Vex,
} from "vexflow";

const { Renderer } = Vex.Flow;

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
  const renderContextRef = useRef<RenderContext | null>(null);

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    try {
      const bars = createBars(state.history, [4, Duration.Quarter]);
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

function drawBar(context: RenderContext, bar: Bar, i: number, offset: number) {
  const notes = bar.events.map(staveNote);

  function pair<T>(l: T[]): [T | null, T][] {
    if (l.length < 2) return [];
    const [a, b, ...rest] = l;
    return [[a, b], ...pair(rest)];
  }
  
  const x = mapPairs([null, ...bar.events], (a, b) => {
    if (b) {
      const sNote = staveNote(b);
      const accidentals = inferAccidentals(b, a, NoteName.C); // HARDCODED
      
      accidentals.forEach((a, i) => {
        sNote.addModifier(new Accidental(a), i);
      });

      return sNote;
    } else {
      return staveNote(a);
    }
  })

  if (notes.length > 2 && notes[1].getKeys().length > 1) {
    notes[1].addModifier(new Accidental("#"), 0);
    notes[1].addModifier(new Accidental("b"), 1);
  }

  const fmtVFNote = (n: StaveNote) => {
    return `${n.getKeys()}`;
  }

  const fmtVFNotes = (notes: StaveNote[]) => {
    return notes.map(fmtVFNote).join(", ");
  }

  console.log("Events:", fmtChunk(bar.events));
  console.log("Notes: ", fmtVFNotes(notes))
  
  const x = i + offset;
  const y = 0;
  const stave = new Stave(x, y, staveWidth(bar));

  if (i === 0) {
    stave.addClef("treble").addTimeSignature(tsToString(bar.ts));
  }

  // Draw stave
  stave.setContext(context).draw();

  // Draw beams ♫
  const beams = Beam.generateBeams(notes);
  Formatter.FormatAndDraw(context, stave, notes);
  beams.forEach(function (b) {
    b.setContext(context).draw();
  });

  // Draw ties ♪‿♪
  const ties = createTies(bar, notes);
  ties.forEach((t) => {
    t.setContext(context).draw();
  });
}

function drawBars(context: RenderContext, bars: Bar[]) {
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
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;
  const parentHeight = parentDiv ? parentDiv.offsetHeight : 200;
  renderer.resize(parentWidth, parentHeight);
  return renderer.getContext();
}

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}
