import React from 'react';

interface StatusToggleProps {
  isOn: boolean;
  label: string;
  onToggle: () => void;
}

/** On/off pill for a workspace state: accepting orders, on shift. */
export const StatusToggle: React.FC<StatusToggleProps> = ({ isOn, label, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isOn}
    className={`chip-tilt inline-flex items-center gap-2 max-w-full min-h-11 px-3.5 py-1.5 border-2 border-ink rounded-xl shadow-hard-3 text-sm font-extrabold text-start cursor-pointer ${
      isOn ? 'bg-tint-tech text-ink' : 'bg-card text-ink-2'
    }`}
  >
    <span
      aria-hidden="true"
      className={`shrink-0 w-3 h-3 rounded-full border-2 border-ink ${isOn ? 'bg-success' : 'bg-transparent'}`}
    />
    <span className="min-w-0">{label}</span>
  </button>
);
