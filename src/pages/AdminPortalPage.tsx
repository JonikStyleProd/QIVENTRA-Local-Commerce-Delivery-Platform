import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  TrendingUp,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BrandAssetsManager } from '../components/admin/BrandAssetsManager';

export const AdminPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();
  const { currentUser, updateUserProfile } = useApp();

  const [stores, setStores] = useState([
    {
      id: 'store-app-1',
      name: language === 'he' ? 'מאפיית לחמים & בית קפה' : language === 'en' ? 'Lehamim Artisan Bakery' : 'Пекарня Lehamim',
      category: language === 'he' ? 'בתי קפה ומאפיות' : language === 'en' ? 'Cafes & Bakeries' : 'Кафе и пекарни',
      address: language === 'he' ? 'תל אביב, רחוב החשמונאים 103' : language === 'en' ? 'Tel Aviv, 103 HaHashmonaim St' : 'Тель-Авив, ул. Ха-Хашмонаим 103',
      status: 'pending',
    },
    {
      id: 'store-app-2',
      name: language === 'he' ? 'מחלבת בוטיק בת שלמה' : language === 'en' ? 'Bat Shlomo Artisan Dairy' : 'Сыроварня Bat Shlomo',
      category: language === 'he' ? 'חוות ומוצרי חלב' : language === 'en' ? 'Farm & Dairy' : 'Фермерские продукты',
      address: language === 'he' ? 'תל אביב, רחוב שינקין 44' : language === 'en' ? 'Tel Aviv, 44 Sheinkin St' : 'Тель-Авив, ул. Шейнкин 44',
      status: 'approved',
    },
    {
      id: 'store-app-3',
      name: language === 'he' ? 'פרחי נווה צדק & בוטיק מתנות' : language === 'en' ? 'Neve Tzedek Floral Boutique' : 'Цветочный бутик Neve Tzedek',
      category: language === 'he' ? 'פרחים ומתנות' : language === 'en' ? 'Flowers & Gifts' : 'Цветы и подарки',
      address: language === 'he' ? 'תל אביב, רחוב שבזי 28' : language === 'en' ? 'Tel Aviv, 28 Shabazi St' : 'Тель-Авив, ул. Шабази 28',
      status: 'approved',
    },
  ]);

  const handleApproveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status: 'approved' } : s))
    );
    showToast({
      type: 'success',
      title: t.admin.merchantVerifiedTitle,
      message: t.admin.merchantVerifiedMsg,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#123B35] text-[#F3F1EA] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#B8D96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                {t.admin.adminHubTitle}
              </h1>
              <Badge variant="pistachio" size="sm">
                {t.admin.monitoringCenter}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {t.admin.adminHubSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-elevated border border-theme text-xs">
            <span className="text-[11px] text-muted px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Роль:
            </span>
            {(['admin', 'customer', 'vendor', 'courier'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  updateUserProfile({ role: r });
                  showToast({
                    type: 'info',
                    title: 'Режим роли изменен',
                    message: `Текущая роль переключена на: ${r}`,
                  });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  currentUser.role === r
                    ? 'bg-[#123B35] text-[#F3F1EA] shadow-2xs'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E824C] animate-pulse" />
            <span className="text-xs font-semibold text-primary">{t.admin.allSystemsOperational}</span>
          </div>
        </div>
      </div>

      {/* Brand Assets Management Section (Admin RLS Protected) */}
      <BrandAssetsManager />

      {/* Overview Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.admin.platformGMV}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            {formatCurrency(48290)}
          </span>
          <span className="text-[11px] text-[#1E824C] dark:text-[#48BB78] font-medium flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3 me-0.5" /> +18.4% {t.admin.todayLabel}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.admin.activeMerchants}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            38 {t.admin.storesCount}
          </span>
          <span className="text-[11px] text-muted mt-1 block">
            {t.admin.inDistricts}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.admin.couriersOnShift}</span>
          <span className="text-2xl font-extrabold text-primary font-sans mt-1 block tabular-nums">
            24 {t.admin.onLine}
          </span>
          <span className="text-[11px] text-[#1E824C] dark:text-[#48BB78] mt-1 block">
            100% {t.admin.ecoFleet}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-theme shadow-xs">
          <span className="text-xs text-secondary block">{t.admin.avgDeliveryTime}</span>
          <span className="text-2xl font-extrabold text-[#123B35] dark:text-[#B8D96B] font-sans mt-1 block tabular-nums">
            27.4 {t.admin.minLabel}
          </span>
          <span className="text-[11px] text-muted mt-1 block">
            {t.admin.targetSLA}
          </span>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Store className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
            <span>{t.admin.merchantApplications}</span>
          </h2>
          <span className="text-xs text-secondary">
            {t.admin.verificationQueue}
          </span>
        </div>

        <div className="space-y-3">
          {stores.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-surface border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-primary">{s.name}</h4>
                  <Badge
                    variant={s.status === 'approved' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {s.status === 'approved' ? t.admin.statusVerified : t.admin.statusPending}
                  </Badge>
                </div>
                <p className="text-xs text-secondary mt-0.5">
                  {s.category} • {s.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {s.status === 'pending' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveStore(s.id)}
                  >
                    {t.admin.approveAndPublish}
                  </Button>
                ) : (
                  <span className="text-xs text-[#1E824C] dark:text-[#48BB78] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {t.admin.activeInCatalog}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
