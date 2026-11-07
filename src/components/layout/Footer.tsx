import React from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';
import { pathFor } from '../../router/paths';
import { MadeBy } from '../collage/MadeBy';
import { Tape } from '../collage/Tape';

const FOOTER_LINK =
  'inline-flex items-center gap-1 min-w-11 min-h-11 text-sm font-bold text-start cursor-pointer hover:underline';

/** Keeps the end of the page clear of what floats over it: phone tabs, and the yellow panel on these screens. */
const bottomSpace = (route: AppRoute): string => {
  if (route === 'delivery') return 'pb-[calc(env(safe-area-inset-bottom,0px)+24px)] desk:pb-8';
  if (route === 'catalog' || route === 'store') return 'pb-[calc(env(safe-area-inset-bottom,0px)+190px)] desk:pb-[130px]';
  return 'pb-[calc(env(safe-area-inset-bottom,0px)+88px)] desk:pb-8';
};

export const Footer: React.FC = () => {
  const { currentRoute } = useApp();
  const { t } = useLanguage();

  const customerLinks: { label: string; route: AppRoute }[] = [
    { label: t.footer.categoriesCatalog, route: 'catalog' },
    { label: t.footer.productSearch, route: 'search' },
    { label: t.footer.activeOrdersTracker, route: 'orders' },
    { label: t.footer.userProfile, route: 'profile' },
  ];
  const businessLinks: { label: string; route: AppRoute }[] = [
    { label: t.footer.vendorAccount, route: 'vendor' },
    { label: t.footer.courierService, route: 'courier' },
    { label: t.footer.adminHub, route: 'admin' },
  ];

  return (
    <footer className={`w-full pt-8 border-t-2 border-ink text-ink ${bottomSpace(currentRoute)}`}>
      <div className="max-w-[1360px] mx-auto px-4 desk:px-10">
        <p className="pb-6 text-[15px] font-extrabold">
          <bdi>QIVENTRA</bdi> · {t.collage.common.demoInline}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-4 gap-6 pb-6 border-b-2 border-paper-dot">
          <p className="text-sm font-semibold text-ink-2 max-w-sm leading-relaxed">{t.footer.brandStatement}</p>

          <div>
            <h2 className="hand mb-1 text-[26px] leading-none text-link-text">{t.footer.forCustomers}</h2>
            <ul>
              {customerLinks.map((link) => (
                <li key={link.route}>
                  <Link to={pathFor(link.route)} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="hand mb-1 text-[26px] leading-none text-link-text">{t.footer.forBusiness}</h2>
            <ul>
              {businessLinks.map((link) => (
                <li key={link.route}>
                  <Link to={pathFor(link.route)} className={FOOTER_LINK}>
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 rtl-flip" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="hand mb-3 text-[26px] leading-none text-link-text">{t.screens.footer.contactsTitle}</h2>
            <p className="relative max-w-[280px] p-3 pt-4 bg-tint-gift border-2 border-ink rounded-xl text-sm font-extrabold -rotate-1">
              <Tape tone="blue" small />
              {t.screens.footer.contactsDemo}
            </p>
          </div>
        </div>

        <nav aria-label={t.demo.legal.links} className="flex flex-wrap gap-x-5 pt-3">
          {(['privacy', 'terms', 'accessibility'] as const).map((route) => (
            <Link key={route} to={pathFor(route)} className={FOOTER_LINK}>
              {t.demo.titles[route]}
            </Link>
          ))}
        </nav>

        <MadeBy className="pt-4" />
      </div>
    </footer>
  );
};
