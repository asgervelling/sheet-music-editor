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

/**
 * Recursive conditional types. \
 * TupleOf<number, 3> = [number, number, number] \
 * https://github.com/microsoft/TypeScript/pull/40002
 */
type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;


/**
 * A tuplet is a group of notes that span
 * a certain number of beats.\
 * For example \
 * 
 * const quarterNoteTriplet: Tuplet<3> = {
 *   notes: [Note.C, Note.PAUSE, Note.E],
 *   span: Duration.Quarter,
 * };
 */
type Tuplet<N extends number> = {
  notes: TupleOf<Note, N>;
  span: Duration;
};
