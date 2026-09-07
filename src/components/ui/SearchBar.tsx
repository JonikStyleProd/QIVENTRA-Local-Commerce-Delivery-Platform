import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showFiltersButton?: boolean;
  onFiltersClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  autoFocus = false,
  showFiltersButton = false,
  onFiltersClick,
  className = '',
  size = 'md',
}) => {
  const [internalValue, setInternalValue] = useState<string>(value);
  const { t, isRTL } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(internalValue);
    }
  };

  const sizeStyles = {
    sm: 'h-9 text-xs px-3',
    md: 'h-11 text-xs sm:text-sm px-3.5',
    lg: 'h-13 text-sm sm:text-base px-4',
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div
        className={`
          flex items-center w-full rounded-2xl bg-surface border border-theme
          focus-within:border-[#123B35] dark:focus-within:border-[#B8D96B]
          focus-within:ring-2 focus-within:ring-[#123B35]/15 dark:focus-within:ring-[#B8D96B]/20
          transition-all duration-150 shadow-xs
          ${sizeStyles[size]}
        `}
      >
        <Search className="w-4 h-4 text-muted shrink-0 me-2.5" />

        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t.nav.searchPlaceholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-primary placeholder:text-muted focus:outline-none"
        />

        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-muted hover:text-primary transition hover:bg-surface-elevated shrink-0 me-1"
            aria-label={t.nav.clear}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {internalValue ? (
          <button
            type="button"
            onClick={() => onSearch?.(internalValue)}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#123B35] text-[#F3F1EA] hover:bg-[#0E2E29] transition ms-1 shrink-0"
            aria-label={t.nav.search}
          >
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        ) : showFiltersButton ? (
          <button
            type="button"
            onClick={onFiltersClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-elevated text-secondary text-xs font-medium hover:text-primary border border-theme transition shrink-0"
            aria-label={t.catalog.title}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.catalog.title}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
