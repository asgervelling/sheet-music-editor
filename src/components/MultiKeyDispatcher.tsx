"use client";
import { useEffect, useState } from "react";

type MultiKeyDispatcherProps = {
  keyCombination: string[];
  onPress: () => void;
};

/**
 * Can fire events when a combination of keys is pressed.
 */
export default function MultiKeyDispatcher({
  keyCombination,
  onPress,
}: MultiKeyDispatcherProps) {
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (!keysPressed.includes(key)) {
        setKeysPressed([...keysPressed, key]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      setKeysPressed([...keysPressed].filter((k) => k !== key));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keysPressed]);

  useEffect(() => {
    if (keyCombination.every((key) => keysPressed.includes(key))) {
      onPress();
    }
  }, [keysPressed]);

  return null;
}