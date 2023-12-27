"use client";
import React, { useContext, useEffect } from 'react';
import { StateContext } from '@/app/context/StateContext';

interface KeyboardKeyProps {
  keyName: string;
}

/**
 * A component that represents a key on the keyboard
 * and is highlighted when its key is pressed.
 */
const KeyboardKey: React.FC<KeyboardKeyProps> = ({ keyName }) => {
  const { state, dispatch } = useContext(StateContext)!;
  const isKeyPressed = state.pressedKeys[keyName] || false;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === keyName) {
        dispatch({ type: 'KEY_PRESSED', payload: { key: keyName } });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (event.key === keyName) {
        dispatch({ type: 'KEY_RELEASED', payload: { key: keyName } });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [dispatch, keyName]);

  return (
    <div style={{ backgroundColor: isKeyPressed ? 'yellow' : 'white', padding: '10px', margin: '5px' }}>
      Key {keyName} is {isKeyPressed ? 'pressed' : 'released'}
    </div>
  );
};

export default KeyboardKey;