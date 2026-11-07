import React from 'react';
import { Tape } from './Tape';

interface PanelProps {
  children: React.ReactNode;
  /** "accent" is the yellow total panel; the rest are the category tints. */
  tone?: 'card' | 'accent' | 'food' | 'health' | 'gift' | 'tech' | 'pets';
  tape?: 'yellow' | 'blue' | 'red';
  className?: string;
  as?: 'div' | 'section' | 'aside' | 'article' | 'li';
  'aria-label'?: string;
}

const TONE: Record<NonNullable<PanelProps['tone']>, string> = {
  card: 'bg-card',
  accent: 'bg-accent',
  food: 'bg-tint-food',
  health: 'bg-tint-health',
  gift: 'bg-tint-gift',
  tech: 'bg-tint-tech',
  pets: 'bg-tint-pets',
};

/** Thick-outlined sheet with a hard shadow: the base of every card that is not a polaroid. */
export const Panel: React.FC<PanelProps> = ({ children, tone = 'card', tape, className = '', as = 'div', ...rest }) => {
  const Tag = as;
  return (
    <Tag
      className={`relative ${TONE[tone]} border-[3px] border-ink rounded-[20px] desk:rounded-3xl shadow-hard-4 desk:shadow-hard-6 p-4 desk:p-6 ${className}`}
      {...rest}
    >
      {tape && <Tape tone={tape} />}
      {children}
    </Tag>
  );
};
