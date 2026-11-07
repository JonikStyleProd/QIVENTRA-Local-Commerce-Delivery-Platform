import React from 'react';

/** Dotted paper background with the same width and gutters on every redrawn screen. */
export const PageShell: React.FC<{ children: React.ReactNode; width?: 'wide' | 'narrow'; className?: string }> = ({
  children,
  width = 'wide',
  className = '',
}) => (
  <div className="paper-dots min-h-screen pb-10 desk:pb-16">
    <div
      className={`${width === 'wide' ? 'max-w-[1360px]' : 'max-w-[1000px]'} mx-auto px-4 desk:px-10 pt-4 desk:pt-6 ${className}`}
    >
      {children}
    </div>
  </div>
);

interface PageHeadingProps {
  note: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}

/** Handwritten note above a big heading, as on the shop picker. */
export const PageHeading: React.FC<PageHeadingProps> = ({ note, title, lead, className = '' }) => (
  <div className={`min-w-0 ${className}`}>
    <p className="hand anim-in inline-block text-[26px] desk:text-[30px] leading-tight text-action -rotate-2">{note}</p>
    <h1 className="anim-in font-black tracking-[-0.03em] leading-[1.02] text-[clamp(32px,5vw,64px)] break-words">{title}</h1>
    {lead && <p className="anim-in mt-2 max-w-[640px] font-bold text-ink-2">{lead}</p>}
  </div>
);

interface SectionHeadingProps {
  title: React.ReactNode;
  note?: string;
  /** Far side of the row, such as a count or an action. */
  aside?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, note, aside, className = '' }) => (
  <div className={`flex flex-wrap items-end justify-between gap-x-3 gap-y-1 mb-3 desk:mb-4 ${className}`}>
    <div className="min-w-0">
      {note && <p className="hand text-2xl desk:text-[26px] leading-none text-link-text">{note}</p>}
      <h2 className="text-[22px] desk:text-[28px] font-black tracking-tight leading-tight">{title}</h2>
    </div>
    {aside}
  </div>
);
