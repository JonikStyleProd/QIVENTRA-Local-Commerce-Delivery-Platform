import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  className = '',
}) => {
  const { language } = useLanguage();

  const defaultTitle = language === 'he' ? 'שגיאה בטעינת הנתונים' : language === 'en' ? 'Unable to load data' : 'Не удалось загрузить данные';
  const defaultMessage = language === 'he' ? 'אנא בדקו את החיבור לאינטרנט או נסו שוב בעוד מספר רגעים.' : language === 'en' ? 'Please check your internet connection or try again in a few moments.' : 'Проверьте соединение с интернетом или повторите попытку через несколько секунд.';
  const defaultRetry = language === 'he' ? 'נסה שוב' : language === 'en' ? 'Try again' : 'Повторить попытку';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-surface border border-[#C53030]/20 ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FDECEB] dark:bg-[#3D1919] text-[#C53030] mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-primary mb-1.5">{title || defaultTitle}</h3>
      <p className="text-sm text-secondary max-w-sm mb-6 leading-relaxed">
        {message || defaultMessage}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onRetry}
        >
          {defaultRetry}
        </Button>
      )}
    </div>
  );
};
