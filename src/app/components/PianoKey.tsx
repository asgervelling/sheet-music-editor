"use client";

type PianoKeyProps = {
  name: string;
  active: boolean;
};

function PianoKey({ name, active }: PianoKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "white",
    color: active ? "white" : "var(--color-primary)",
  };

  return (
    <div className="flex flex-col justify-end items-center
      w-10 h-40 p-1
      bg-white border border-black rounded-md"
      style={keyStyle}
    >
      <p>{name}</p>
    </div>
  )
}

export default PianoKey;