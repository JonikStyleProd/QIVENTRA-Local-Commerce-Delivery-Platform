import React from 'react';

interface BottomPanelProps {
  note: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

/** Yellow panel that floats over the page: what is picked, and the way forward. */
export const BottomPanel: React.FC<BottomPanelProps> = ({ note, title, children }) => (
  <div
    className="anim-bar fixed inset-x-3 desk:inset-x-4 bottom-[var(--panel-bottom)] desk:bottom-5 z-30 max-w-[820px] mx-auto"
  >
    <div className="flex items-center justify-between gap-2.5 desk:gap-3.5 p-2.5 ps-4 desk:p-3.5 desk:ps-6 bg-accent border-[3px] border-ink rounded-[18px] desk:rounded-[22px] shadow-hard-4 desk:shadow-hard-6">
      <p className="min-w-0 text-sm desk:text-base font-black desk:font-extrabold">
        <span className="hand block text-xl desk:text-2xl leading-none">{note}</span>
        {title}
      </p>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  </div>
);
