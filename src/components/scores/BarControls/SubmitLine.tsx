type SubmitLineProps = {
  children: React.ReactNode;
}

export function SubmitLine({ children }: SubmitLineProps) {
  return (
    <div className="grid grid-cols-5 items-center gap-4 pt-2">
      <div className="col-span-3" />
      <div className="col-span-2">
        {children}
      </div>
    </div>
  );
}
