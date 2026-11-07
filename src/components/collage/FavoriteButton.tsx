import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

interface FavoriteButtonProps {
  kind: 'stores' | 'products';
  id: string;
  name: string;
  className?: string;
}

/** The heart on a shop or product. Favorites stay in this browser. */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ kind, id, name, className = '' }) => {
  const { favorites, toggleFavorite } = useApp();
  const { t } = useLanguage();
  const isOn = favorites[kind].includes(id);
  const label = (isOn ? t.demo.favorites.remove : t.demo.favorites.add).replace('{name}', name);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(kind, id)}
      aria-pressed={isOn}
      aria-label={label}
      title={label}
      className={`chip-tilt grid place-items-center w-11 h-11 shrink-0 border-2 border-ink rounded-xl cursor-pointer ${
        isOn ? 'bg-accent text-action-text' : 'bg-card text-ink'
      } ${className}`}
    >
      <Heart aria-hidden="true" fill={isOn ? 'currentColor' : 'none'} strokeWidth={2.4} className="w-5 h-5" />
    </button>
  );
};
