/**
 * @fileoverview
 * Our sheet music system are rendered with VexFlow,
 * a sheet music library.
 * Since it adds elements to the DOM as a side effect,
 * we will limit the number of re-renders by React
 * and let this component use VexFlow instead.
 */
"use client";
import { createTies, toStaveNote } from "@/app/sheet_music";
import { StateContext } from "@/app/state/StateContext";
import { Bar, MusicalEvent } from "@/app/state/music";
import { createBars } from "@/app/state/music/bars";
import { Duration } from "@/app/state/music/durations";
import { c4t, c8, e8, p2 } from "@/app/state/music/test_helpers";
import { useContext, useEffect, useRef } from "react";
import { Formatter, RenderContext, Stave, StaveTie, Vex, Voice } from "vexflow";

const { Renderer } = Vex.Flow;

const STAVE_WIDTH = 200;
const STAVE_HEIGHT = 40;

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
}

/**
 * VexFlow playground.
 */
export default function VexFlowExample() {
  const containerRef = useRef(null);
  const renderContextRef = useRef<RenderContext | null>(null);

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    const bars: Bar[] = [
      {
        ts: [4, Duration.Quarter],
        events: [c4t, c8, e8, p2],
      }
    ];

    // As EasyScore notation:
    // 

    const VF = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "boo".
    var vf = new VF.Factory({renderer: {elementId: DIV_ID.OUTPUT, width: 1200, height: 600}});
    var score = vf.EasyScore();
    var system = vf.System();

    system.addStave({
      voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'))]
    }).addClef('treble').addTimeSignature('4/4');
    
    vf.draw();
    

    return cleanUp;
  }, [containerRef.current]);

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
  } catch (e) {
    displayError(e);
  }
}
