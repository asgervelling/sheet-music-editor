type SVGPianoKeyProps = {
  x: number
  y: number
  width: number
  height: number
}

export default function SVGPianoKey({ x, y, width, height }: SVGPianoKeyProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="#111"
      strokeWidth="0.125"
    />
  )
}