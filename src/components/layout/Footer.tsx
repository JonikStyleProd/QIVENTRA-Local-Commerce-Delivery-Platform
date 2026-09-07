import React from 'react';
import { Mail, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();
  const { t, language } = useLanguage();

  const handleNav = (route: AppRoute) => {
    navigateTo(route);
  };

  const getCopyrightText = () => {
    return 'Produced and developed by JonikStyle Production. All rights reserved by JonikStyle Production.';
  };

  const getAccessibilityLabel = () => {
    switch (language) {
      case 'he':
        return 'נגישות';
      case 'ru':
        return 'Доступность';
      case 'en':
      default:
        return 'Accessibility';
    }
  };

  const getContactsTitle = () => {
    switch (language) {
      case 'he':
        return 'יצירת קשר ותמיכה';
      case 'ru':
        return 'Контакты & Поддержка';
      case 'en':
      default:
        return 'Contact & Support';
    }
  };

  return (
    <footer className="w-full bg-[#123B35] text-[#F3F1EA] pt-12 pb-24 md:pb-12 border-t border-[#1C524A] transition-colors select-none">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#1E564E]">
          
          {/* Column 1: Official Brand & Statement */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <div
                  onClick={() => handleNav('home')}
                  className="text-2xl font-black tracking-widest text-[#F3F1EA] hover:text-[#B8D96B] transition cursor-pointer select-none inline-block font-sans"
                >
                  QIVENTRA
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F3F1EA]/85 max-w-sm leading-relaxed">
                {t.footer.brandStatement}
              </p>
            </div>
          </div>

          {/* Column 2: Navigation for Customers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8D96B] mb-3.5">
              {t.footer.forCustomers}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3F1EA]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('catalog')}
                  className="hover:text-white hover:underline transition text-start"
                >
                  {t.footer.categoriesCatalog}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('search')}
                  className="hover:text-white hover:underline transition text-start"
                >
                  {t.footer.productSearch}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('orders')}
                  className="hover:text-white hover:underline transition text-start"
                >
                  {t.footer.activeOrdersTracker}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('profile')}
                  className="hover:text-white hover:underline transition text-start"
                >
                  {t.footer.userProfile}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation for Business & Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8D96B] mb-3.5">
              {t.footer.forBusiness}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3F1EA]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('vendor')}
                  className="hover:text-white hover:underline transition flex items-center gap-1"
                >
                  <span>{t.footer.vendorAccount}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B8D96B] shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('courier')}
                  className="hover:text-white hover:underline transition flex items-center gap-1"
                >
                  <span>{t.footer.courierService}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B8D96B] shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('admin')}
                  className="hover:text-white hover:underline transition flex items-center gap-1"
                >
                  <span>{t.footer.adminHub}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B8D96B] shrink-0" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Clean Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8D96B] mb-3.5">
              {getContactsTitle()}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3F1EA]/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8D96B] shrink-0" />
                <span dir="ltr">+972 (3) 890-1200</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8D96B] shrink-0" />
                <span>support@qiventra.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#B8D96B] shrink-0" />
                <span>{language === 'he' ? 'מדי יום: 07:00 – 01:00' : language === 'ru' ? 'Ежедневно: 07:00 – 01:00' : 'Daily: 07:00 – 01:00'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#F3F1EA]/75">
          <p className="text-center md:text-start leading-relaxed font-medium">
            {getCopyrightText()}
          </p>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="hover:text-white transition cursor-pointer">{t.footer.privacy}</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">{t.footer.terms}</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">{getAccessibilityLabel()}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
