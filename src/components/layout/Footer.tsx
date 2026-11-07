import React from 'react';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';

const COPYRIGHT = 'Produced and developed by JonikStyle Production. All rights reserved by JonikStyle Production.';

const FOOTER_LINK =
  'inline-flex items-center gap-1 min-h-11 text-sm font-bold text-start cursor-pointer hover:underline';

export const Footer: React.FC = () => {
  const { navigateTo, currentRoute } = useApp();
  const { t, language } = useLanguage();

  const accessibilityLabel = language === 'he' ? 'נגישות' : language === 'ru' ? 'Доступность' : 'Accessibility';
  const contactsTitle =
    language === 'he' ? 'יצירת קשר ותמיכה' : language === 'ru' ? 'Контакты и поддержка' : 'Contact & Support';
  const hoursLabel =
    language === 'he' ? 'מדי יום: 07:00 – 01:00' : language === 'ru' ? 'Ежедневно: 07:00 – 01:00' : 'Daily: 07:00 – 01:00';

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

  // Room for the fixed phone tabs, which the delivery window does not have.
  const phoneBottomSpace = currentRoute === 'delivery' ? 'pb-6' : 'pb-24';

  return (
    <footer className={`w-full pt-8 desk:pb-8 border-t-2 border-ink text-ink ${phoneBottomSpace}`}>
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
                  <button type="button" onClick={() => navigateTo(link.route)} className={FOOTER_LINK}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="hand mb-1 text-[26px] leading-none text-link-text">{t.footer.forBusiness}</h2>
            <ul>
              {businessLinks.map((link) => (
                <li key={link.route}>
                  <button type="button" onClick={() => navigateTo(link.route)} className={FOOTER_LINK}>
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 shrink-0 rtl-flip" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="hand mb-1 text-[26px] leading-none text-link-text">{contactsTitle}</h2>
            <ul className="space-y-2 text-sm font-bold">
              <li className="flex items-center gap-2">
                <Phone aria-hidden="true" className="w-4 h-4 shrink-0" />
                <span dir="ltr">+972 (3) 890-1200</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail aria-hidden="true" className="w-4 h-4 shrink-0" />
                <bdi>support@qiventra.com</bdi>
              </li>
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" className="w-4 h-4 shrink-0" />
                <span>{hoursLabel}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4 text-[13px] font-bold text-ink-3">
          <p dir="ltr">{COPYRIGHT}</p>
          <p>
            {t.footer.privacy} · {t.footer.terms} · {accessibilityLabel}
          </p>
        </div>
      </div>
    </footer>
  );
};
