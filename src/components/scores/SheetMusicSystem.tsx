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
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";

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
  const { state } = useContext(StateContext)!;
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

  function drawBars(context: VF.RenderContext, bars: SheetMusicBar[]): void {
    function drawRow(row: [number[], SheetMusicBar[]], i: number): void {
      zip(...row).reduce((x, [width, bar], j) => {
        bar.stave.setX(x);
        bar.stave.setY(i * bar.stave.getHeight());

        const elem = context.openGroup("classss", "iddd");
        bar.stave.setContext(context).draw();

        const hoverableArea = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        hoverableArea.setAttribute("x", `${bar.stave.getX()}`);
        hoverableArea.setAttribute("y", `${bar.stave.getTopLineTopY()}`);
        const areaHeight =
          bar.stave.getBottomLineY() - bar.stave.getTopLineTopY();
        hoverableArea.setAttribute("width", `${bar.stave.getWidth()}`);
        hoverableArea.setAttribute("height", `${areaHeight}`);
        hoverableArea.setAttribute("fill", "rgba(255, 0, 0, 0.5)");

        hoverableArea.addEventListener("click", (event: MouseEvent) =>
          handleClickOnStave(event, j)
        );

        bar.voices.forEach((v) => v.draw(context, bar.stave));
        bar.beams.forEach((b) => b.setContext(context).draw());
        bar.ties.forEach((t) => t.setContext(context).draw());

        elem.appendChild(hoverableArea);
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
    console.log("Open, clickedStave", open, clickedStave);
  }

  const handleClickOnContainer: MouseEventHandler = (event) => {
    event.stopPropagation();
    setClickedStave(null);
  };

  function handleClickOnStave(event: MouseEvent, staveIndex: number) {
    event.stopPropagation();
    setClickedStave(staveIndex);
  }

  return (
    <div>
      <div id={DIV_ID.ERROR}></div>
      <div
        id={DIV_ID.CONTAINER}
        ref={containerRef}
        className="h-[900px] w-[600px] border border-black"
        onClick={handleClickOnContainer}
      >
        {/* Use PopoverTrigger with the output div */}
        <Popover.Root></Popover.Root>
        <Popover.Root onOpenChange={toggleBarControls}>
          <Popover.Trigger asChild>
            <div id={DIV_ID.OUTPUT}></div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="PopoverContent" sideOffset={5}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <p className="Text" style={{ marginBottom: 10 }}>
                  Dimensions
                </p>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="width">
                    Width
                  </label>
                  <input className="Input" id="width" defaultValue="100%" />
                </fieldset>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="maxWidth">
                    Max. width
                  </label>
                  <input className="Input" id="maxWidth" defaultValue="300px" />
                </fieldset>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="height">
                    Height
                  </label>
                  <input className="Input" id="height" defaultValue="25px" />
                </fieldset>
                <fieldset className="Fieldset">
                  <label className="Label" htmlFor="maxHeight">
                    Max. height
                  </label>
                  <input className="Input" id="maxHeight" defaultValue="none" />
                </fieldset>
              </div>
              <Popover.Close className="PopoverClose" aria-label="Close">
                <Cross2Icon />
              </Popover.Close>
              <Popover.Arrow className="PopoverArrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
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

    const stave = new VF.Stave(x, y, 0);

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
    const staveWidth = (vWidth + stave.getModifierXShift()) * 1.25;
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

// /**
//  * A component to be shown above or below a bar
//  * when that bar is clicked on.
//  * It should provide a small user interface
//  * to set the clef, key signature and time signature of that bar.
//  */
// function BarControls() {
//   return (
//     <Popover onOpenChange={(open) => console.log("Open:", open)}>
//       <PopoverTrigger>Click me</PopoverTrigger>
//       <PopoverContent>Place content for the popover here.</PopoverContent>
//     </Popover>
//   );
// }

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
    }, 0)
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
