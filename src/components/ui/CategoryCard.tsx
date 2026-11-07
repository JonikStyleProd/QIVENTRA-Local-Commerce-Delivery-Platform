import React from 'react';
import {
  Apple,
  Smartphone,
  Home,
  Coffee,
  HeartPulse,
  Flower2,
  PawPrint,
  Dumbbell,
  ShoppingBag,
} from 'lucide-react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  const { language, t } = useLanguage();

  const displayName = category.names?.[language] || category.name;

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'grocery':
        return <Apple className="w-6 h-6" />;
      case 'electronics':
        return <Smartphone className="w-6 h-6" />;
      case 'home':
        return <Home className="w-6 h-6" />;
      case 'bakery':
        return <Coffee className="w-6 h-6" />;
      case 'pharmacy':
        return <HeartPulse className="w-6 h-6" />;
      case 'flowers':
        return <Flower2 className="w-6 h-6" />;
      case 'pets':
        return <PawPrint className="w-6 h-6" />;
      case 'sports':
        return <Dumbbell className="w-6 h-6" />;
      default:
        return <ShoppingBag className="w-6 h-6" />;
    }
  };

  const getPlacesCountLabel = (count: number) => {
    if (language === 'he') {
      return `${count} מקומות`;
    }
    if (language === 'en') {
      return `${count} places`;
    }
    return `${count} мест`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200
        select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D]
        active:scale-96 min-w-[104px]
        ${
          isSelected
            ? 'bg-[#1E1E1E] text-[#FFF8EC] shadow-md ring-2 ring-[#FFD84D]'
            : 'bg-surface hover:bg-surface-elevated text-primary border border-theme hover:border-[#CEC9B9] dark:hover:border-[#3A4742] shadow-xs'
        }
      `}
    >
      <div
        className={`
          flex items-center justify-center w-12 h-12 rounded-xl mb-2.5 transition-transform duration-200 group-hover:scale-105
          ${
            isSelected
              ? 'bg-[#FFD84D] text-[#1E1E1E]'
              : 'bg-surface-elevated text-[#1E1E1E] dark:text-[#FFD84D] group-hover:bg-[#FFD84D]/20'
          }
        `}
      >
        {getIcon(category.slug)}
      </div>

      <span className="text-xs font-semibold tracking-tight line-clamp-1">
        {displayName}
      </span>

      <span
        className={`text-[11px] mt-0.5 tabular-nums ${
          isSelected ? 'text-[#FFF8EC]/80' : 'text-secondary'
        }`}
      >
        {getPlacesCountLabel(category.storesCount)}
      </span>
    </button>
  );
};
