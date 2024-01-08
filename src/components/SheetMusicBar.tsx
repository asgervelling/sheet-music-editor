// "use client";
// import { useContext, useEffect, useRef } from 'react';
// import { toStaveNote } from "@/app/sheet_music";
// import { Bar } from "@/app/state/music";
// import { Formatter, Stave, Voice, Vex } from "vexflow";
// import { SheetMusicContext } from './SheetMusicCanvas';

// const STAVE_WIDTH = 200;
// const STAVE_HEIGHT = 40;

// enum DIV_ID {
//   CONTAINER = "sheet-music-container",
//   OUTPUT = "output",
//   ERROR = "error",
// }

// function createStave() {
//   const [x, y] = [0, STAVE_HEIGHT];
//   const stave = new Stave(x, y, STAVE_WIDTH);
//   return stave;
// }

// function displayError(e: any): void {
//   const errorDiv = document.getElementById(DIV_ID.ERROR);
//   if (errorDiv) {
//     errorDiv.innerHTML = e.message;
//   }
// }

// export default function SheetMusicBar({ timeSignature, events }: Bar) {
//   const { renderer } = useContext(SheetMusicContext)!;
//   const isMounted = useRef(false);

//   useEffect(() => {
//     if (!isMounted.current) {
//       const stave = new Stave(0, 0, STAVE_WIDTH);
//       const notes = events.map(toStaveNote);
//       const voice = new Voice({ num_beats: 4, beat_value: 4 });
//       voice.addTickables(notes);

//       try {
//         new Formatter().joinVoices([voice]).formatToStave([voice], stave);
//         stave.setContext(renderer).draw();
//         voice.draw(renderer, stave);
//       } catch (e) {
//         displayError(e);
//       }

//       isMounted.current = true;
//     }
//   }, [renderer, events]);

//   return null;
// }
