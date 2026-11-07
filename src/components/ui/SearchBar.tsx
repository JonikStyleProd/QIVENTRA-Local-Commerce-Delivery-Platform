import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

/** Search field; the value lives with the caller, so sample queries show up in the input. */
export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder, label, className = '' }) => {
  const { t } = useLanguage();

  return (
    <div
      role="search"
      className={`flex items-center gap-2 w-full min-h-[56px] ps-3.5 pe-1.5 bg-card border-[3px] border-ink rounded-2xl shadow-hard-4 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-focus ${className}`}
    >
      <Search aria-hidden="true" className="w-5 h-5 shrink-0 text-ink-3" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={placeholder || t.nav.searchPlaceholder}
        className="flex-1 min-w-0 bg-transparent font-bold text-ink placeholder:text-ink-3 placeholder:font-semibold outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t.nav.clear}
          className="grid place-items-center w-11 h-11 shrink-0 rounded-xl cursor-pointer hover:bg-tint-pets"
        >
          <X aria-hidden="true" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
