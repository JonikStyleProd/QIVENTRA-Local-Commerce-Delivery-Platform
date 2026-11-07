import React, { useState } from 'react';
import { Link } from 'react-router';
import { Bike, Camera, ChevronRight, LogOut, MapPin, MessageSquare, Moon, ShieldCheck, Smartphone, Store, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { AppRoute } from '../types';
import { pathFor } from '../router/paths';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { PhotoUploadModal } from '../components/media/PhotoUploadModal';
import { PageHeading, PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { PolaroidPhoto } from '../components/collage/PolaroidPhoto';
import { Stamp } from '../components/collage/Stamp';

const ROW = 'flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 first:pt-0 last:pb-0';
const TILE =
  'chip-tilt flex items-start gap-3 w-full p-3.5 border-2 border-ink rounded-2xl shadow-hard-3 text-start cursor-pointer';

export const ProfilePage: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { currentAddress, currentUser, isSignedIn, signOut, updateUserProfile, setIsAddressModalOpen, setIsAuthModalOpen, openChatWithParticipant } = useApp();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const copy = t.screens.profile;

  const handleLogout = () => {
    signOut();
    showToast({ type: 'info', title: t.demo.auth.signedOutTitle, message: t.demo.auth.signedOutMsg });
  };

  const displayName = isSignedIn ? currentUser.names?.[language] || currentUser.name : t.demo.auth.guestName;

  const workspaces: { route: AppRoute; title: string; desc: string; icon: React.ReactNode; tint: string }[] = [
    {
      route: 'vendor',
      title: t.profile.vendorPortalTitle,
      desc: t.profile.vendorPortalDesc,
      icon: <Store aria-hidden="true" className="w-5 h-5 shrink-0" />,
      tint: 'bg-tint-food',
    },
    {
      route: 'courier',
      title: t.profile.courierPortalTitle,
      desc: t.profile.courierPortalDesc,
      icon: <Bike aria-hidden="true" className="w-5 h-5 shrink-0" />,
      tint: 'bg-tint-tech',
    },
    {
      route: 'admin',
      title: t.profile.adminPortalTitle,
      desc: t.profile.adminPortalDesc,
      icon: <ShieldCheck aria-hidden="true" className="w-5 h-5 shrink-0" />,
      tint: 'bg-tint-health',
    },
  ];

  return (
    <PageShell width="narrow">
      <section className="flex flex-wrap items-center gap-5 desk:gap-8 mb-7 desk:mb-10">
        <div className="relative shrink-0 w-[112px] desk:w-[140px] bg-card p-2 pb-3 -rotate-3 shadow-polaroid">
          <PolaroidPhoto src={currentUser.avatarUrl} alt={displayName} noteClassName="text-lg" eager />
          <IconButton
            onClick={() => setIsUploadModalOpen(true)}
            aria-label={t.media.changePhoto}
            title={t.media.changePhoto}
            icon={<Camera aria-hidden="true" className="w-4 h-4" />}
            className="absolute! -bottom-2 -end-3 rotate-3"
          />
        </div>

        <div className="flex-1 min-w-[220px]">
          <PageHeading note={isSignedIn ? copy.note : t.demo.auth.guestNote} title={displayName} />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Stamp tone="action">{isSignedIn ? copy.demoProfile : t.demo.auth.guestName}</Stamp>
            <span className="text-sm font-bold text-ink-2">{isSignedIn ? copy.demoProfileDesc : t.demo.auth.guestDesc}</span>
          </div>
          <p className="mt-1 text-sm font-bold text-ink-2">{t.demo.auth.note}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {isSignedIn ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  {t.profile.switchAccount}
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<LogOut aria-hidden="true" className="w-4 h-4" />} onClick={handleLogout}>
                  {t.demo.auth.signOut}
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                {t.demo.auth.signIn}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid desk:grid-cols-2 gap-6 items-start">
        <Panel as="section" tape="blue" aria-label={t.profile.savedAddresses}>
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="w-5 h-5 shrink-0 text-action-text" />
                {t.profile.savedAddresses}
              </span>
            }
            aside={
              <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                {t.profile.manage}
              </Button>
            }
          />
          <ul className="divide-y-2 divide-paper-dot">
            {currentUser.savedAddresses.map((addr) => (
              <li key={addr.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black">{addr.titles?.[language] || addr.title}</span>
                  {addr.isDefault && <Stamp>{t.address.primaryBadge}</Stamp>}
                </div>
                <p className="text-sm font-bold text-ink-2 break-words">{addr.addresses?.[language] || addr.address}</p>
              </li>
            ))}
            {currentUser.savedAddresses.length === 0 && <li className="font-bold">{currentAddress}</li>}
          </ul>
        </Panel>

        <Panel as="section" tape="yellow" aria-label={t.profile.appSettings}>
          <SectionHeading
            title={
              <span className="inline-flex items-center gap-2">
                <Smartphone aria-hidden="true" className="w-5 h-5 shrink-0" />
                {t.profile.appSettings}
              </span>
            }
          />
          <div className="divide-y-2 divide-paper-dot">
            <div className={ROW}>
              <p className="font-black">{t.profile.languageSetting}</p>
              <LanguageSwitcher />
            </div>
            <div className={ROW}>
              <div className="min-w-0">
                <p className="font-black">{t.profile.themeSetting}</p>
                <p className="text-sm font-bold text-ink-2">
                  {resolvedTheme === 'dark' ? t.profile.themeDark : t.profile.themeLight}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                leftIcon={
                  resolvedTheme === 'dark' ? (
                    <Sun aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Moon aria-hidden="true" className="w-4 h-4" />
                  )
                }
              >
                {t.profile.switchTheme}
              </Button>
            </div>
            <div className={ROW}>
              <div className="min-w-0 flex-1 min-w-[180px]">
                <p className="font-black">{t.profile.pwaSetting}</p>
                <p className="text-sm font-bold text-ink-2">{t.profile.pwaDesc}</p>
              </div>
              <PWAInstallButton />
            </div>
          </div>
        </Panel>
      </div>

      <section className="mt-8 desk:mt-10">
        <SectionHeading note={copy.moreNote} title={copy.workspaces} />
        <ul className="grid sm:grid-cols-2 desk:grid-cols-4 gap-3.5">
          <li>
            <button type="button" onClick={() => openChatWithParticipant()} className={`${TILE} bg-tint-gift h-full`}>
              <MessageSquare aria-hidden="true" className="w-5 h-5 shrink-0" />
              <span className="min-w-0">
                <span className="block font-black leading-snug">{t.screens.menu.messages}</span>
                <span className="block mt-0.5 text-sm font-bold text-ink-2">{copy.messagesDesc}</span>
              </span>
            </button>
          </li>
          {workspaces.map((space) => (
            <li key={space.route}>
              <Link to={pathFor(space.route)} className={`${TILE} ${space.tint} h-full`}>
                {space.icon}
                <span className="min-w-0 flex-1">
                  <span className="block font-black leading-snug">{space.title}</span>
                  <span className="block mt-0.5 text-sm font-bold text-ink-2">{space.desc}</span>
                </span>
                <ChevronRight aria-hidden="true" className="w-4 h-4 shrink-0 mt-1 rtl-flip" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t.media.changePhoto}
        category="avatar"
        currentImageUrl={currentUser.avatarUrl}
        onSuccess={(dataUrl) => {
          updateUserProfile({ avatarUrl: dataUrl });
          setIsUploadModalOpen(false);
        }}
      />
    </PageShell>
  );
};
