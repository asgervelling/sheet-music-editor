/**
 * Enum for the different types of messages
 * that can be given to the reducer
 * to update state.
 */
export enum Message {
  SET_DURATION = "SET_DURATION",
  TOGGLE_ACTIVE_NOTE = "TOGGLE_ACTIVE_NOTE",
  COMMIT = "COMMIT",
  KEY_PRESS = "KEY_PRESS",
  KEY_RELEASE = "KEY_RELEASE",
}
