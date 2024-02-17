"use client";
import { useEffect, useRef } from "react";

export type RenderFunction = () => void;

type ReactWrapperProps = {
  render: RenderFunction;
};

/**
 * This component is an abstraction for
 * a non-react library that manipulates the DOM.
 */
export default function ReactWrapper({ render }: ReactWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      render();
    }
  }, [render]);

  return (
    <div ref={containerRef}>
      {/* Content rendered by the non-react library will be displayed here */}
    </div>
  );
}
