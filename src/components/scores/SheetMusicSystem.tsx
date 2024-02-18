/**
 * @fileoverview
 * Our sheet music system are rendered with VexFlow,
 * a sheet music library.
 * Since it adds elements to the DOM as a side effect,
 * we will limit the number of re-renders by React
 * and let this component use VexFlow instead.
 */
"use client";
import {
  MouseEventHandler,
  ReactPortal,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as VF from "vexflow";

import { createTies, staveNote } from "@/app/music/sheet_music";
import { StateContext } from "@/app/state/StateContext";
import { Bar, Clef } from "@/app/music";
import { chunk, partitionToMaxSum, zip } from "@/app/music/arrays";
import { createBars } from "@/app/music/bars";
import { NoteName, Duration } from "@/app/music";
import { beatValue, tsToString } from "@/app/music/time_signatures";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Message } from "@/app/state/messages";
import { BarControls } from "./BarControls";
import { PopoverPortal } from "@radix-ui/react-popover";
import { createPortal } from "react-dom";
import ReactWrapper, { RenderFunction } from "../ReactWrapper";

const { Renderer } = VF.Vex.Flow;

/**
 * The VexFlow representation of a `Bar`.
 */
type VexFlowBar = {
  stave: VF.Stave;
  voices: VF.Voice[];
  beams: VF.Beam[];
  ties: VF.StaveTie[];
};

enum DIV_ID {
  CONTAINER = "sheet-music-container",
  OUTPUT = "output",
  ERROR = "error",
}

/**
 * A system of staves. Will be rendered as sheet music.
 */
export default function SheetMusicSystem() {
  const { state, dispatch } = useContext(StateContext)!;
  const containerRef = useRef(null);
  const renderContextRef = useRef<VF.RenderContext | null>(null);
  const [clickedStave, setClickedStave] = useState<number | null>(null);
  const [sheetMusicData, setSheetMusicData] = useState<RenderFunction | null>(
    null
  );
  // sheetMusicData: variable is never used
  
  useEffect(() => {
    console.log("useEffect triggered");

    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    const bars = createBars(
      state.history,
      Clef.Treble,
      [4, Duration.Quarter],
      NoteName.Bb
    );

    const drawnBars: RenderFunction = drawBars(context, vexFlowBars(bars));

    setSheetMusicData(() => drawnBars);

    return cleanUp;
  }, [containerRef.current, state.history]);

  /**
   * Show or hide the BarControls for the bar
   * the user clicked on.
   * @param open True if the user is opening the BarControls.
   */
  function toggleBarControls(open: boolean) {
    dispatch({
      type: Message.KeyboardLocked,
      payload: { value: open },
    });
  }

  const handleClickOnContainer: MouseEventHandler = (event) => {
    setClickedStave(null);
  };

  function handleClickOnStave(event: MouseEvent, staveIndex: number) {
    event.stopPropagation();
    setClickedStave(staveIndex);
  }

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div id={DIV_ID.CONTAINER} ref={containerRef} className="h-[900px]">
        <div id={DIV_ID.OUTPUT}>
          {renderContextRef.current && sheetMusicData && (
            <System
              context={renderContextRef.current}
              sheetMusicData={sheetMusicData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

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

// Todo: Rename
function drawBars(
  context: VF.RenderContext,
  bars: VexFlowBar[]
): RenderFunction {
  function drawRow(row: [number[], VexFlowBar[]], i: number): RenderFunction {
    let functions: RenderFunction[] = [];

    zip(...row).reduce((x, [width, bar], j) => {
      bar.stave.setX(x);
      bar.stave.setY(i * bar.stave.getHeight());

      console.log("Bar", i, j);

      const render: RenderFunction = () => {
        const group = context.openGroup("stavegroup", `stavegroup-${i}-${j}`);
        group.appendChild(createClickableArea(bar.stave, j));
        group.addEventListener("click", (event: MouseEvent) => {
          console.log("Clicked bar", i + j);
        });
        bar.stave.setContext(context).draw();
        bar.voices.forEach((v) => v.draw(context, bar.stave));
        bar.beams.forEach((b) => b.setContext(context).draw());
        bar.ties.forEach((t) => t.setContext(context).draw());
        context.closeGroup();
      };

      functions.push(render);

      return x + width;
    }, 0);

    return () => functions.forEach((fn) => fn());
  }

  const widthRows = staveWidths(bars);
  const barRows = chunk(
    bars,
    widthRows.map((r) => r.length)
  );
  const functions = zip(widthRows, barRows).map((row, i) => {
    return drawRow(row, i);
  });
  const render: RenderFunction = () => {
    functions.forEach((row, i) => {
      console.log("row", i)
      row();
    });
  };

  console.log();
  return render;
}

function System({
  context,
  sheetMusicData,
}: {
  context: VF.RenderContext;
  sheetMusicData: RenderFunction;
}) {
  console.log("system");
  return (
    <>
      <ReactWrapper render={sheetMusicData} />
    </>
  );
}

/**
 * Create an area as big as the stave
 * to use as a clickable overlay.
 * @param stave The stave we want to make clickable.
 * @param i `stave`'s index in the bar.
 * @returns An SVG Rect that can be clicked.
 */
function createClickableArea(stave: VF.Stave, i: number): SVGRectElement {
  const area = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  area.setAttribute("x", `${stave.getX()}`);
  area.setAttribute("y", `${stave.getTopLineTopY()}`);
  const areaHeight = stave.getBottomLineBottomY() - stave.getTopLineTopY();
  area.setAttribute("width", `${stave.getWidth()}`);
  area.setAttribute("height", `${areaHeight}`);

  return area;
}

function vexFlowBars(bars: Bar[]): VexFlowBar[] {
  function create(bars: Bar[], i: number, x: number, y: number): VexFlowBar[] {
    if (bars.length === 0) return [];

    const [bar, ...rest] = bars;
    const key = bar.keySig;
    const notes = bar.events.map(staveNote);

    const stave = new VF.Stave(x, y, 300);

    // Voice
    const voice = new VF.Voice({
      num_beats: bar.timeSig[0],
      beat_value: beatValue(bar.timeSig),
    });
    const voices = [voice.addTickables(notes)];
    VF.Accidental.applyAccidentals(voices, key);
    new VF.Formatter().joinVoices(voices).format(voices);
    const vWidth = voiceWidth(voice);
    new VF.Formatter().joinVoices([voice]).format([voice], vWidth);

    if (i === 0) {
      stave
        .addClef(bar.clef)
        .addTimeSignature(tsToString(bars[i].timeSig))
        .addKeySignature(key);
    }
    // Modify stave's width to fit its contents
    const staveWidth = vWidth * 1.25 + stave.getModifierXShift();
    stave.setWidth(staveWidth);

    // Beams ♫
    const beams = VF.Beam.generateBeams(notes);

    // Ties ♪‿♪
    const ties = createTies(bar, notes);

    const b: VexFlowBar = { stave, voices: [voice], beams, ties };
    return [b, ...create(rest, i + 1, x + staveWidth, y)];
  }

  const [i, x, y] = [0, 0, 0];
  return create(bars, i, x, y);
}

/**
 * Create rows of widths, where each row has a sum \
 * smaller than or equal to the size of the container.
 */
function staveWidths(bars: VexFlowBar[]): number[][] {
  let container = document.getElementById(DIV_ID.CONTAINER);
  let containerWidth = container?.offsetWidth ?? 1300; // HARDCODED

  const widths = bars.map((b) => Math.min(b.stave.getWidth(), containerWidth));
  return partitionToMaxSum(widths, containerWidth);
}

/**
 * The width of a voice, which should be slightly
 * smaller than the width of a stave.
 */
function voiceWidth(voice: VF.Voice) {
  const minWidth = 100;
  return Math.max(
    minWidth,
    voice.getTickables().reduce((acc, t) => {
      const smallestXShift = t
        .getModifiers()
        .reduce((acc, m) => Math.min(acc, m.getXShift()), 0);
      return acc + t.getWidth() + Math.abs(smallestXShift);
    }, 0) * 1.25
  );
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
    errorDiv.innerHTML = e;
  }
}
