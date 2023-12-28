/**
 * The user can input keys on a keyboard or,
 * if they are in break mode, they can input pauses
 * without Piano, simply by dispatching Message.COMMIT.
 */
export enum InputMode {
  Notes = "Notes",
  Pauses = "Pauses",
}