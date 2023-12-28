"use client";
import React, { useContext, useEffect } from 'react';
import { StateContext } from '@/app/context/StateContext';
import { NoteLength } from '@/lib/music_theory';

interface NoteLengthKeyProps {
  noteLength: NoteLength;
}

/**
 * A component that represents a key on the NoteLength
 * and is highlighted when its key is pressed.
 */
const NoteLengthKey: React.FC<NoteLengthKeyProps> = ({ noteLength }) => {
  const { state, dispatch } = useContext(StateContext)!;
  const isCurrentNote = state.currNoteLength === noteLength;


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toString() === noteLength.toString()) {
        dispatch({ type: 'KEY_PRESSED', payload: { key: event.key } });
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (event.key.toString() === noteLength.toString()) {
        dispatch({ type: 'KEY_RELEASED', payload: { key: event.key } });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [dispatch]);


  return (
    <div
      style={{ backgroundColor: isCurrentNote ? 'yellow' : 'white', padding: '10px', margin: '5px' }}
      className="h-10 w-10 text-center"
    >
      {noteLength.toString()}
    </div>
  );
};

export default NoteLengthKey;