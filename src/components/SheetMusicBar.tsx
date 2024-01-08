import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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

function createRenderContext() {
  const renderer = new Renderer(DIV_ID.OUTPUT, Renderer.Backends.SVG);
  const parentDiv = document.getElementById(DIV_ID.CONTAINER);
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

function SheetMusicBar({ timeSignature, events }: Bar) {
  const containerRef = useRef(null);

  useEffect(() => {
    const context = createRenderContext();
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

    return () => {
      [DIV_ID.OUTPUT, DIV_ID.ERROR].forEach((id) => {
        const div: HTMLElement | null = document.getElementById(id);
        if (div) {
          div.innerHTML = "";
        }
      });
    };
  }, [containerRef.current]);

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div id={DIV_ID.CONTAINER} ref={containerRef}>
        <div id={DIV_ID.OUTPUT}></div>
      </div>
    </div>
  );
}

export default SheetMusicBar;
