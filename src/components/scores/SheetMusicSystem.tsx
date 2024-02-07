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
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import { NoteName } from "@/app/state/music/events";
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
      // drawSMBars(context, createSheetMusicBars(bars));
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

function drawBars(context: VF.RenderContext, bars: Bar[]) {
  
  function draw(bars: Bar[], i: number, x: number, y: number) {
    if (bars.length === 0) return;

    const [bar, ...rest] = bars;
    const key = NoteName.C; // HARDCODED key
    const notes = bar.events.map(staveNote);

    // Voice
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }); // HARDCODED
    voice.addTickables(notes);
    VF.Accidental.applyAccidentals([voice], key);
    new VF.Formatter().joinVoices([voice]).format([voice]);
    const vWidth = voiceWidth(voice);
    new VF.Formatter().joinVoices([voice]).format([voice], vWidth);
    
    // Stave
    const stave = new VF.Stave(x, y, vWidth);
    if (i === 0) {
      // HARDCODED clef
      stave.addClef("treble").addTimeSignature(tsToString(bars[i].ts));
    }
    const staveWidth = (vWidth + stave.getModifierXShift()) * 1.25;
    console.log(`${staveWidth} = ${stave.getWidth()} + ${stave.getModifierXShift()}`)
    stave.setWidth(staveWidth);
    
    // Beams ♫
    const beams = VF.Beam.generateBeams(notes);
    
    // Ties ♪‿♪
    const ties = createTies(bar, notes);

    // Draw bar
    stave.setContext(context).draw();
    voice.draw(context, stave);
    beams.forEach((b) => b.setContext(context).draw());
    ties.forEach((t) => t.setContext(context).draw());

    // Draw the next bars
    draw(rest, i + 1, x + staveWidth, y);
  }

  const [x, y] = [0, 0];
  draw(bars, 0, x, y);
}

function voiceWidth(voice: VF.Voice) {
  return voice.getTickables().reduce((acc, t) => {
    const smallestXShift = t.getModifiers().reduce((acc, m) => Math.min(acc, m.getXShift()), 0);
    console.log(t.getWidth() + Math.abs(smallestXShift));
    return acc + t.getWidth() + Math.abs(smallestXShift);
  }, 0)
}

/**
 * Create a VexFlow renderer and return its context.
 * @param containerId The ID of the output element's parent element.
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
