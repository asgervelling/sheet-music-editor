import KeyIndicator from "./KeyIndicator"

export default function UndoIndicatorGroup() {
  return (
    <div className="flex gap-x-2 items-center">
      <KeyIndicator keyCode="Control" label="Ctrl" />
      +
      <KeyIndicator keyCode="z" label="Z" />
      <p className="ps-2">Undo</p>
    </div>
  )
}