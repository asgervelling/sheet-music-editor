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

const { Renderer } = VF.Vex.Flow;

/**
 * The VexFlow representation of a `Bar`.
 */
type SheetMusicBar = {
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

  useEffect(() => {
    const context = createRenderContext(DIV_ID.CONTAINER, DIV_ID.OUTPUT);
    renderContextRef.current = context;

    try {
      const bars = createBars(
        state.history,
        Clef.Treble,
        [4, Duration.Quarter],
        NoteName.Bb
      ); // HARDCODED clef, time and key signature
      drawBars(context, sheetMusicBars(bars));
    } catch (e) {
      displayError(e);
    }

    return cleanUp;
  }, [containerRef.current, state.history]);

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

  function drawBars(context: VF.RenderContext, bars: SheetMusicBar[]): void {
    function drawRow(row: [number[], SheetMusicBar[]], i: number): void {
      zip(...row).reduce((x, [width, bar], j) => {
        bar.stave.setX(x);
        bar.stave.setY(i * bar.stave.getHeight());

        const group = context.openGroup("stavegroup", `stavegroup-${i}-${j}`);
        group.appendChild(createClickableArea(bar.stave, j));
        group.addEventListener("click", (event: MouseEvent) => {
          handleClickOnStave(event, i);
        });

        bar.stave.setContext(context).draw();
        bar.voices.forEach((v) => v.draw(context, bar.stave));
        bar.beams.forEach((b) => b.setContext(context).draw());
        bar.ties.forEach((t) => t.setContext(context).draw());

        context.closeGroup();
        return x + width;
      }, 0);
    }

    const widthRows = staveWidths(bars);
    const barRows = chunk(
      bars,
      widthRows.map((r) => r.length)
    );
    zip(widthRows, barRows).forEach((row, i) => drawRow(row, i));
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
        <Popover onOpenChange={toggleBarControls}>
          <PopoverTrigger asChild>
            <div id={DIV_ID.OUTPUT}></div>
          </PopoverTrigger>
          <PopoverContent>
            <BarControls />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function sheetMusicBars(bars: Bar[]): SheetMusicBar[] {
  function create(
    bars: Bar[],
    i: number,
    x: number,
    y: number
  ): SheetMusicBar[] {
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

    const b: SheetMusicBar = { stave, voices: [voice], beams, ties };
    return [b, ...create(rest, i + 1, x + staveWidth, y)];
  }

  const [i, x, y] = [0, 0, 0];
  return create(bars, i, x, y);
}

/**
 * Create rows of widths, where each row has a sum \
 * smaller than or equal to the size of the container.
 */
function staveWidths(bars: SheetMusicBar[]): number[][] {
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
