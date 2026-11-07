import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ScreenStrings } from '../../i18n/screens';

const COMPANY = 'JonikStyle Production';

/** Fills in the year; shared with the tests so the rule lives in one place. */
export const madeByRightsLine = (template: string, year: number): string =>
  template.replace('{year}', String(year));

interface MadeByViewProps {
  copy: ScreenStrings['madeBy'];
  year?: number;
  className?: string;
}

/**
 * Author signature, separate from the language context so the error screen can show it too.
 * The logo is the author's mark: never recoloured or mirrored, and not a link until a site exists.
 */
export const MadeByView: React.FC<MadeByViewProps> = ({ copy, year = new Date().getFullYear(), className = '' }) => {
  const [beforeName, afterName = ''] = madeByRightsLine(copy.rights, year).split(COMPANY);

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-bold text-ink-3 ${className}`}>
      <span className="inline-flex items-center gap-2 shrink-0">
        <span>{copy.created}</span>
        <picture className="shrink-0">
          <source
            type="image/webp"
            srcSet="/brand/jonikstyle-logo-36.webp 96w, /brand/jonikstyle-logo-72.webp 191w, /brand/jonikstyle-logo.webp 426w"
            sizes="(min-width: 56.25rem) 96px, 80px"
          />
          <img
            src="/brand/jonikstyle-logo-160.png"
            alt={COMPANY}
            width={96}
            height={36}
            loading="lazy"
            decoding="async"
            className="made-by-logo block w-auto h-[30px] desk:h-9"
          />
        </picture>
      </span>
      <span className="min-w-0">
        {beforeName}
        <bdi>{COMPANY}</bdi>
        {afterName}
      </span>
    </div>
  );
};

/** The one signature used everywhere; it lives in the shared footer, so a screen never shows two. */
export const MadeBy: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  return <MadeByView copy={t.screens.madeBy} className={className} />;
};
