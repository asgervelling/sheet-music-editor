import { useEffect, useState } from "react";
import MultiKeyDispatcher from "./MultiKeyDispatcher";

type CommandControlsProps = {
  keyCombination: string[];
  onPress: () => void;
  commandName: string;
};

/**
 * Can fire events when a combination of keys is pressed.
 */
export default function CommandControls({
  keyCombination,
  onPress,
  commandName,
}: CommandControlsProps) {
  const [blinkTime, setBlinkTime] = useState(0);

  useEffect(() => {
    if (blinkTime > 0) {
      const interval = setInterval(() => {
        console.log("interval", blinkTime);
        setBlinkTime(blinkTime - 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [blinkTime]);

  const active = blinkTime > 0;

  const style = {
    backgroundColor: active ? "var(--color-primary)" : "var(--color-bg)",
    color: active ? "var(--color-bg)" : "var(--color-primary)",
  };

  const labels = keyCombination.map((k) => (k === "Control" ? "Ctrl" : k));

  return (
    <div>
      <MultiKeyDispatcher
        keyCombination={keyCombination}
        onPress={() => {
          setBlinkTime(1000);
          console.log("blink time set", blinkTime);
          onPress();
        }}
      />
      <div className="transition-all flex gap-x-2">
        {labels.map((key, i) => (
          <div
            key={i}
            className="border border-[var(--color-primary)] p-2 select-none"
            style={style}
          >
            {key}
          </div>
        ))}
        <div className="ps-4 py-2 select-none">{commandName}</div>
      </div>
    </div>
  );
}