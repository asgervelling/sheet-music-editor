"use client";
import { createContext, useRef, useState, useCallback, useEffect } from "react";
import { RenderContext, Vex } from "vexflow";
import SheetMusicBar from './SheetMusicBar';

const { Renderer } = Vex.Flow;

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
  const parentHeight = parentDiv ? parentDiv.offsetHeight : 200;
  renderer.resize(parentWidth, parentHeight);
  return renderer.getContext();
}