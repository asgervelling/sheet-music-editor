import ComputerKey from "./ComputerKey";

export default function NoteLengthControls() {
  return (
    <div className="flex flex-row">
      <ComputerKey name="1" active={false} />
      <ComputerKey name="2" active={false} />
      <ComputerKey name="3" active={true} />
      <ComputerKey name="4" active={false} />
      <ComputerKey name="5" active={false} />
    </div>
  );
}
