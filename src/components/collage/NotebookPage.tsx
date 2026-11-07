import React from 'react';
import { HandCheck } from './HandMarks';

/** Lined notebook sheet with a red margin. Rows that sit on the lines are 44px tall. */
export const NotebookPage: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`anim-page relative bg-card border-2 border-ink rounded-md shadow-hard-5 desk:shadow-hard-8 py-4 desk:py-[34px] ps-[46px] desk:ps-[70px] pe-3.5 desk:pe-[34px] [background-image:repeating-linear-gradient(transparent_0_43px,var(--color-notebook-line)_43px_44px)] [background-position:0_16px] desk:[background-position:0_30px] ${className}`}
  >
    <span aria-hidden="true" className="absolute inset-y-0 start-8 desk:start-[50px] w-0.5 bg-notebook-margin" />
    {children}
  </div>
);

export interface NotebookStep {
  key: string;
  label: string;
  detail?: React.ReactNode;
  state: 'done' | 'current' | 'todo';
}

/** Status steps written into a notebook: done ones are ticked, the current one is filled in red. */
export const NotebookSteps: React.FC<{ steps: NotebookStep[]; label: string }> = ({ steps, label }) => (
  <ol aria-label={label}>
    {steps.map((step) => (
      <li key={step.key} aria-current={step.state === 'current' ? 'step' : undefined} className="min-h-11 py-1">
        <div className="flex items-center gap-2.5 desk:gap-3 min-h-9">
          <span
            aria-hidden="true"
            className="relative shrink-0 w-6 h-6 desk:w-[26px] desk:h-[26px] border-[2.5px] border-ink rounded-md"
          >
            {step.state === 'done' && <HandCheck />}
            {step.state === 'current' && <span className="absolute inset-[3px] rounded-[2px] bg-action" />}
          </span>
          <span
            className={`text-lg desk:text-xl leading-tight ${
              step.state === 'todo' ? 'font-bold text-ink-3' : 'font-black'
            }`}
          >
            {step.label}
          </span>
        </div>
        {step.detail && (
          <div className="mt-0.5 mb-1 ps-[34px] desk:ps-[38px] text-sm font-bold text-ink-2 break-words">{step.detail}</div>
        )}
      </li>
    ))}
  </ol>
);
