import React, { useEffect, useRef, useState } from "react";
import { toStaveNote } from "@/app/sheet_music";
import { Bar, Duration, MusicalEvent, Note } from "@/app/state/music";
import { Formatter, Stave, Voice, Vex, RenderContext } from "vexflow";

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

function displayError(e: any): void {
  const errorDiv = document.getElementById(DIV_ID.ERROR);
  if (errorDiv) {
    errorDiv.innerHTML = e.message;
  }
}

export function Canvas() {
  const containerRef = useRef(null);
  const renderContextRef = useRef<RenderContext | null>(null);

  // Test data
  const bars: Bar[] = [
    {
      timeSignature: "4/4",
      events: [
        {
          notes: [Note.D, Note.E, Note.G],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C, Note.E, Note.G],
          duration: Duration.Quarter,
        },
        {
          notes: [Note.C, Note.E, Note.G],
          duration: Duration.Quarter,
        },
      ],
    },
  ];

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;
  }, [containerRef.current]);

  return (
    <>
      {renderContextRef ? (
        <>
          <div id={DIV_ID.ERROR}></div>
          <div id={DIV_ID.CONTAINER} ref={containerRef}>
            <div id={DIV_ID.OUTPUT}>f</div>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
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

function draw(context: RenderContext, stave: Stave, voice: Voice): void {
  try {
    new Formatter().joinVoices([voice]).formatToStave([voice], stave);
    stave.setContext(context).draw();
    voice.draw(context, stave);
  }
  catch (e) {
    displayError(e);
  }
}

export default function SheetMusic({ timeSignature, events }: Bar) {
  const containerRef = useRef(null);
  const renderContextRef = useRef<RenderContext | null>(null);

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;
    
    const testEvent = {
      notes: [Note.C],
      duration: Duration.Whole,
    };

    const x = 0;
    const stave = createStave(events, x);
    const voice = createVoice(events);

    const x2 = stave.getWidth();
    const stave2 = createStave([testEvent], x2);
    const voice2 = createVoice([testEvent]);
    
    draw(context, stave, voice);
    draw(context, stave2, voice2);

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
        {/* <div>
          {events.map((event, i) => (
            <div key={i}>
              {event.notes.map((note, j) => (
                <span key={j}>{note}</span>
              ))}
              <span>{event.duration}</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
