import React from 'react';
import { PageHeading } from './Page';

interface PortalHeaderProps {
  icon: React.ReactNode;
  note: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Workspace controls on the far side: status toggle, role switch. */
  children?: React.ReactNode;
}

/** Top of a workspace: icon sticker, heading, and the workspace's own controls. */
export const PortalHeader: React.FC<PortalHeaderProps> = ({ icon, note, title, lead, children }) => (
  <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 mb-6 desk:mb-9">
    <div className="flex items-start gap-3.5 desk:gap-5 min-w-0 flex-[1_1_320px]">
      <span
        aria-hidden="true"
        className="grid place-items-center shrink-0 w-14 h-14 desk:w-[72px] desk:h-[72px] mt-1 bg-accent text-ink border-[3px] border-ink rounded-2xl shadow-hard-3 -rotate-3"
      >
        {icon}
      </span>
      <PageHeading note={note} title={title} lead={lead} className="flex-1" />
    </div>
    {children && <div className="flex flex-wrap items-center gap-2.5 min-w-0">{children}</div>}
  </header>
);
