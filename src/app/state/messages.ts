/**
 * Enum for the different types of messages
 * that can be given to the reducer
 * to update state.
 */
export enum Message {
  SetDuration = "SET_DURATION",
  ToggleActiveNote = "TOGGL_ACTIVE_NOTE",
  Commit = "COMMIT",
  KeyPress = "KEY_PRESS",
  KeyRelease = "KEY_RELEASE",
  KeyboardLocked = "KEYBOARD_LOCKED",
}
