import { MusicalEvent } from "./events";
import { TimeSignature } from "./time_signatures";

/**
 * A bar has a time signature and some musical events.
 *
 * @param ts Time signature: A fraction where the numerator
 * is an integer greater than 0, and the denominator is
 * a power of two.
 * @param events A musical event is an array of notes (such as [C, E, G])
 * and a duration. In this simple version just focusing
 * on durations, an event is simply an array of durations.
 */
export type Bar = {
  ts: TimeSignature;
  events: MusicalEvent[];
};
