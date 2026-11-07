import React, { useEffect, useRef, useState } from 'react';
import { Bike, MessageSquare, ShieldCheck, Store as StoreIcon, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppRoute } from '../../types';
import { IconButton } from '../ui/IconButton';

const ITEM =
  'flex items-center gap-2.5 w-full min-h-11 px-3 text-sm font-extrabold text-start cursor-pointer hover:bg-tint-gift focus-visible:bg-tint-gift';

/** Profile button with the secondary destinations: profile page, chat and the workspaces. */
export const ProfileMenu: React.FC = () => {
  const { navigateTo, openChatWithParticipant } = useApp();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const menuItems = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  useEffect(() => {
    if (!isOpen) return;
    menuItems()[0]?.focus();
    const handleOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = menuItems();
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  const goTo = (route: AppRoute) => {
    close(false);
    navigateTo(route);
  };

  const portals: { label: string; route: AppRoute; icon: React.ReactNode }[] = [
    { label: t.nav.vendorPortal, route: 'vendor', icon: <StoreIcon aria-hidden="true" className="w-4 h-4 shrink-0" /> },
    { label: t.nav.courierHub, route: 'courier', icon: <Bike aria-hidden="true" className="w-4 h-4 shrink-0" /> },
    { label: t.nav.adminHub, route: 'admin', icon: <ShieldCheck aria-hidden="true" className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        ref={buttonRef}
        icon={<User aria-hidden="true" className="w-5 h-5" />}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label={t.screens.menu.label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={t.nav.profile}
      />

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t.screens.menu.label}
          onKeyDown={handleMenuKeyDown}
          className="anim-drop absolute end-0 z-30 w-72 mt-2 py-2 bg-card text-ink border-[3px] border-ink rounded-2xl shadow-hard-4 overflow-hidden"
        >
          <button type="button" role="menuitem" tabIndex={-1} onClick={() => goTo('profile')} className={ITEM}>
            <User aria-hidden="true" className="w-4 h-4 shrink-0" />
            {t.nav.profile}
          </button>
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={() => {
              close(false);
              openChatWithParticipant();
            }}
            className={ITEM}
          >
            <MessageSquare aria-hidden="true" className="w-4 h-4 shrink-0" />
            {t.screens.menu.messages}
          </button>

          <p className="hand mt-1 px-3 text-2xl leading-tight text-link-text">{t.screens.menu.portals}</p>
          {portals.map((portal) => (
            <button
              key={portal.route}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => goTo(portal.route)}
              className={ITEM}
            >
              {portal.icon}
              {portal.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
