type BarControlsLineProps = {
  children: React.ReactNode;
};

export function BarControlsLine({ children }: BarControlsLineProps) {
  return <div className="grid grid-cols-3 items-center gap-4">{children}</div>;
}
