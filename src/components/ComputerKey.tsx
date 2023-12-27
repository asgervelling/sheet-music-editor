type ComputerKeyProps = {
  name: string;
  active: boolean;
};

export default function ComputerKey({ name, active }: ComputerKeyProps) {
  const keyStyle = {
    backgroundColor: active ? "#CE7B91" : "var(--color-bg)",
    color: active ? "white" : "var(--color-primary)",
  };

  return (
    <div
      className="flex flex-col justify-end items-center
      w-8 h-8
      border border-black rounded-md"
      style={keyStyle}
    >
      <p>{name}</p>
    </div>
  );
}