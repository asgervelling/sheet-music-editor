import { Duration, Note } from ".";

/**
 * A single note or pause is a list of length 1.
 * A chord is a list of notes.
 */
export type MusicalEvent = {
  notes: Note[];
  duration: Duration;
};

/**
 * A bar is a list of musical events
 * with a time signature.
 * Use the time signature to validate the bar.
 */
export type Bar = {
  timeSignature: Fraction;
  events: MusicalEvent[];
};

/**
 * A fraction with a numerator and a denominator.
 */
export type Fraction = [number, number];