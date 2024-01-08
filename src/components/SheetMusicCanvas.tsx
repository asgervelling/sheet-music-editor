"use client";
import { createContext, useRef, useState, useCallback, useEffect, useContext } from "react";
import { Formatter, RenderContext, Stave, Vex, Voice } from "vexflow";
import { Bar } from "@/app/state/music";
import { toStaveNote } from "@/app/sheet_music";

const { Renderer } = Vex.Flow;

const STAVE_WIDTH = 200;
const STAVE_HEIGHT = 40;

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
}

type SheetMusicCanvasProps = {
  children: React.ReactNode;
};

type SheetMusicContextProps = {
  renderer: RenderContext;
};

export const SheetMusicContext = createContext<SheetMusicContextProps | undefined>(undefined);

export default function SheetMusicCanvas({ children }: SheetMusicCanvasProps) {
  const [renderer, setRenderer] = useState<RenderContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRenderer = useCallback(() => {
    if (containerRef.current) {
      const newRenderer = createRenderContext(DIV_ID.CONTAINER);
      setRenderer(newRenderer);
    }
  }, []);

  useEffect(() => {
    createRenderer();
  }, [createRenderer]);

  return (
    <>
      <div ref={containerRef} id={DIV_ID.CONTAINER}>
        {renderer && (
          <SheetMusicContext.Provider value={{ renderer }}>
            {children}
            <div id={`${DIV_ID.CONTAINER}-${DIV_ID.ERROR}`}></div>
            <div id={`${DIV_ID.CONTAINER}-${DIV_ID.OUTPUT}`}></div>
          </SheetMusicContext.Provider>
        )}
      </div>
    </>
  );
}

/**
 * Make the element denoted by id be a place
 * for VexFlow to render.
 */
function createRenderContext(id: string) {
  const renderer = new Renderer(id, Renderer.Backends.SVG);
  const parentDiv = document.getElementById(id);
  const parentWidth = parentDiv ? parentDiv.offsetWidth : 500;
  const parentHeight = 200;
  renderer.resize(parentWidth, parentHeight);
  return renderer.getContext();
}

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}

export function SheetMusicBar({ timeSignature, events }: Bar) {
  const { renderer } = useContext(SheetMusicContext)!;
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      const stave = new Stave(0, 0, STAVE_WIDTH);
      const notes = events.map(toStaveNote);
      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);

      try {
        new Formatter().joinVoices([voice]).formatToStave([voice], stave);
        stave.setContext(renderer).draw();
        voice.draw(renderer, stave);
      } catch (e) {
        displayError(e);
      }

      isMounted.current = true;
    }
  }, [renderer, events]);

  return null;
}
