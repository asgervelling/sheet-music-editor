import React, { useEffect, useRef, useState } from 'react';
import { toStaveNote } from "@/app/sheet_music";
import { Bar } from "@/app/state/music";
import { Formatter, Stave, Voice, Vex } from "vexflow";

const { Renderer } = Vex.Flow;

const STAVE_WIDTH = 200;
const STAVE_HEIGHT = 40;

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
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

function createStave() {
  const [x, y] = [0, STAVE_HEIGHT];
  const stave = new Stave(x, y, STAVE_WIDTH);
  return stave;
}

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}

function Canvas({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null);

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div id={DIV_ID.CONTAINER} ref={containerRef}>
        <div id={DIV_ID.OUTPUT}></div>
      </div>
    </div>
  );
}

export default function SheetMusic({ timeSignature, events }: Bar) {
  const containerRef = useRef(null);
  const [on, setOn] = useState(false);

  function addStave() {

  }

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    const stave = createStave();
    const notes = events.map(toStaveNote);
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    try {
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);

      stave.setContext(context).draw();
      voice.draw(context, stave);
    } catch (e) {
      displayError(e);
    }

    setOn(true);

    return () => {
      [DIV_ID.OUTPUT, DIV_ID.ERROR].forEach((id) => {
        const div: HTMLElement | null = document.getElementById(id);
        if (div) {
          div.innerHTML = "";
        }
      });
    };
  }, [containerRef.current]);

  // useEffect(() => {
  //   console.log("turned on");
  // }, [on]);

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div id={DIV_ID.CONTAINER} ref={containerRef}>
        <div id={DIV_ID.OUTPUT}></div>
      </div>
    </div>
  );
}
