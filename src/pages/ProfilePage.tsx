import React, { useState } from 'react';
import {
  MapPin,
  Smartphone,
  ShieldCheck,
  Moon,
  Sun,
  Store,
  Bike,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Camera,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { SafeImage } from '../components/ui/SafeImage';
import { PhotoUploadModal } from '../components/media/PhotoUploadModal';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    setIsAddressModalOpen,
    setIsAuthModalOpen,
    navigateTo,
  } = useApp();

  const { language, t, isRTL } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleLogout = () => {
    showToast({
      type: 'info',
      title: t.profile.logout,
      message: t.auth.demoNotice,
    });
    setIsAuthModalOpen(true);
  };

  const displayName = currentUser.names?.[language] || currentUser.name;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Card Header */}
      <div className="rounded-3xl bg-surface border border-theme p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#123B35] text-[#F3F1EA] overflow-hidden shadow-md flex items-center justify-center border-2 border-theme">
              {currentUser.avatarUrl ? (
                <SafeImage
                  src={currentUser.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  fallbackText={initials}
                />
              ) : (
                <span className="text-xl font-bold">{initials || 'QA'}</span>
              )}
            </div>

            {/* Quick Upload / Camera trigger */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="absolute -bottom-1 -end-1 p-1.5 rounded-xl bg-surface border border-theme text-primary hover:text-[#123B35] dark:hover:text-[#B8D96B] shadow-sm transition hover:scale-110"
              title={t.media.changePhoto}
              aria-label={t.media.changePhoto}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">{displayName}</h1>
              <Badge variant="pistachio" size="sm">
                {t.profile.activeClient}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5" dir="ltr">{currentUser.phone}</p>
            <p className="text-xs text-muted" dir="ltr">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthModalOpen(true)}
          >
            {t.profile.switchAccount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
            className="text-secondary hover:text-[#C53030]"
          >
            {t.profile.logout}
          </Button>
        </div>
      </div>

      {/* Grid of Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saved Addresses Section */}
        <div className="rounded-3xl bg-surface border border-theme p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
              <span>{t.profile.savedAddresses}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs font-semibold text-[#123B35] dark:text-[#B8D96B] hover:underline"
            >
              {t.profile.manage}
            </button>
          </div>

          <div className="space-y-2.5">
            {currentUser.savedAddresses.map((addr) => {
              const addrTitle = addr.titles?.[language] || addr.title;
              const addrText = addr.addresses?.[language] || addr.address;
              return (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-2xl bg-surface-elevated border border-theme flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{addrTitle}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817] font-semibold">
                          {t.address.primaryBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-1">{addrText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PWA, Language & System Settings Section */}
        <div className="rounded-3xl bg-surface border border-theme p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-primary flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B]" />
            <span>{t.profile.appSettings}</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Language Switcher Row */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-theme flex items-center justify-between">
              <div>
                <span className="font-bold text-primary block">{t.profile.languageSetting}</span>
                <span className="text-secondary text-[11px]">
                  {language === 'he' ? 'עברית (RTL)' : language === 'en' ? 'English (LTR)' : 'Русский'}
                </span>
              </div>
              <LanguageSwitcher variant="compact" />
            </div>

            {/* Theme Toggle Row */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-theme flex items-center justify-between">
              <div>
                <span className="font-bold text-primary block">{t.profile.themeSetting}</span>
                <span className="text-secondary text-[11px]">
                  {resolvedTheme === 'dark' ? t.profile.themeDark : t.profile.themeLight}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                leftIcon={
                  resolvedTheme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-[#B8D96B]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[#123B35]" />
                  )
                }
              >
                {t.profile.switchTheme}
              </Button>
            </div>

            {/* PWA In-App Card */}
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-theme flex items-center justify-between">
              <div>
                <span className="font-bold text-primary block">{t.profile.pwaSetting}</span>
                <span className="text-secondary text-[11px]">
                  {t.profile.pwaDesc}
                </span>
              </div>
              <PWAInstallButton />
            </div>
          </div>
        </div>

        {/* Role Portals Fast Access */}
        <div className="md:col-span-2 rounded-3xl bg-surface-elevated border border-theme p-6 shadow-xs">
          <h3 className="text-base font-bold text-primary mb-1">
            {t.profile.partnerPortalsTitle}
          </h3>
          <p className="text-xs text-secondary mb-4">
            {t.profile.partnerPortalsDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => navigateTo('vendor')}
              className="p-4 rounded-2xl bg-surface border border-theme hover:border-primary text-start transition group"
            >
              <Store className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B] mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B]">
                  {t.profile.vendorPortalTitle}
                </span>
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-muted" />}
              </div>
              <span className="text-[11px] text-secondary mt-1 block">
                {t.profile.vendorPortalDesc}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('courier')}
              className="p-4 rounded-2xl bg-surface border border-theme hover:border-primary text-start transition group"
            >
              <Bike className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B] mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B]">
                  {t.profile.courierPortalTitle}
                </span>
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-muted" />}
              </div>
              <span className="text-[11px] text-secondary mt-1 block">
                {t.profile.courierPortalDesc}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="p-4 rounded-2xl bg-surface border border-theme hover:border-primary text-start transition group"
            >
              <ShieldCheck className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B] mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B]">
                  {t.profile.adminPortalTitle}
                </span>
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-muted" />}
              </div>
              <span className="text-[11px] text-secondary mt-1 block">
                {t.profile.adminPortalDesc}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Photo / Avatar Upload Modal */}
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
    </div>
  );
};
