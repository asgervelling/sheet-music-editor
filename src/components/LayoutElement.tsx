// extend div
type LayoutElementProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutElement({ children, className }: LayoutElementProps) {
  return <div className={`py-20 px-32 ${className}`}>{children}</div>;
}
