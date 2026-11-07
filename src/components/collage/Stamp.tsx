import React from 'react';

interface StampProps {
  children: React.ReactNode;
  tone?: 'success' | 'warn' | 'danger' | 'neutral' | 'action';
  className?: string;
}

const TONE: Record<NonNullable<StampProps['tone']>, string> = {
  success: 'text-success border-success',
  warn: 'text-warn border-warn',
  danger: 'text-danger border-danger',
  neutral: 'text-ink-2 border-ink-2',
  action: 'text-action-text border-action-text',
};

/** Rubber stamp for statuses. It has no fill, so it sits on whichever sheet is behind it. */
export const Stamp: React.FC<StampProps> = ({ children, tone = 'neutral', className = '' }) => (
  <span
    className={`inline-block px-2 py-0.5 border-[2.5px] rounded-lg text-xs font-black tracking-wide -rotate-2 ${TONE[tone]} ${className}`}
  >
    {children}
  </span>
);
