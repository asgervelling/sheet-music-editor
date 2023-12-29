import KeyIndicator from "./KeyIndicator"

export default function RedoIndicatorGroup() {
  return (
    <div className="flex gap-2 items-center">
      <KeyIndicator keyCode="Control" label="Ctrl" />
      +
      <KeyIndicator keyCode="x" label="X" />
      <p className="ps-2">Redo</p>
    </div>
  )
}