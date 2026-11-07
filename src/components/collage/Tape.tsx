import React from 'react';

interface TapeProps {
  tone?: 'yellow' | 'blue' | 'red';
  small?: boolean;
}

/** Strip of "scotch" tape across a card's top edge. Purely decorative. */
export const Tape: React.FC<TapeProps> = ({ tone = 'yellow', small = false }) => (
  <span
    aria-hidden="true"
    className={`tape ${tone === 'blue' ? 'tape-blue' : tone === 'red' ? 'tape-red' : ''} ${small ? 'tape-sm' : ''}`}
  />
);
