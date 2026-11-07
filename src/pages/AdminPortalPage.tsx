import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { BrandAssetsManager } from '../components/admin/BrandAssetsManager';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { PortalHeader } from '../components/collage/PortalHeader';
import { SegmentedControl } from '../components/collage/SegmentedControl';
import { Stamp } from '../components/collage/Stamp';
import { DemoFiguresNote, StatSticker } from '../components/collage/StatSticker';

export const AdminPortalPage: React.FC = () => {
  const { language, t, formatCurrency } = useLanguage();
  const { showToast } = useToast();
  const { currentUser, updateUserProfile } = useApp();
  const portal = t.screens.portal;

  // Statuses live apart from the text, so the list follows a language switch.
  const [statuses, setStatuses] = useState<Record<string, 'pending' | 'approved'>>({
    'store-app-1': 'pending',
    'store-app-2': 'approved',
    'store-app-3': 'approved',
  });

  const stores = [
    {
      id: 'store-app-1',
      name: language === 'he' ? 'מאפיית לחמים & בית קפה' : language === 'en' ? 'Lehamim Artisan Bakery' : 'Пекарня Lehamim',
      category: language === 'he' ? 'בתי קפה ומאפיות' : language === 'en' ? 'Cafes & Bakeries' : 'Кафе и пекарни',
      address: language === 'he' ? 'תל אביב, רחוב החשמונאים 103' : language === 'en' ? 'Tel Aviv, 103 HaHashmonaim St' : 'Тель-Авив, ул. Ха-Хашмонаим 103',
    },
    {
      id: 'store-app-2',
      name: language === 'he' ? 'מחלבת בוטיק בת שלמה' : language === 'en' ? 'Bat Shlomo Artisan Dairy' : 'Сыроварня Bat Shlomo',
      category: language === 'he' ? 'חוות ומוצרי חלב' : language === 'en' ? 'Farm & Dairy' : 'Фермерские продукты',
      address: language === 'he' ? 'תל אביב, רחוב שינקין 44' : language === 'en' ? 'Tel Aviv, 44 Sheinkin St' : 'Тель-Авив, ул. Шейнкин 44',
    },
    {
      id: 'store-app-3',
      name: language === 'he' ? 'פרחי נווה צדק & בוטיק מתנות' : language === 'en' ? 'Neve Tzedek Floral Boutique' : 'Цветочный бутик Neve Tzedek',
      category: language === 'he' ? 'פרחים ומתנות' : language === 'en' ? 'Flowers & Gifts' : 'Цветы и подарки',
      address: language === 'he' ? 'תל אביב, רחוב שבזי 28' : language === 'en' ? 'Tel Aviv, 28 Shabazi St' : 'Тель-Авив, ул. Шабази 28',
    },
  ];

  const handleApproveStore = (storeId: string) => {
    setStatuses((prev) => ({ ...prev, [storeId]: 'approved' }));
    showToast({
      type: 'success',
      title: t.admin.merchantVerifiedTitle,
      message: t.admin.merchantVerifiedMsg,
    });
  };

  return (
    <PageShell>
      <PortalHeader
        icon={<ShieldCheck className="w-7 h-7 desk:w-9 desk:h-9" />}
        note={t.admin.monitoringCenter}
        title={t.admin.adminHubTitle}
        lead={t.admin.adminHubSubtitle}
      >
        <SegmentedControl
          label={portal.role}
          value={currentUser.role}
          onChange={(role) => {
            updateUserProfile({ role });
            showToast({
              type: 'info',
              title: portal.roleChangedTitle,
              message: portal.roleChangedMsg.replace('{role}', portal.roles[role]),
            });
          }}
          options={(['admin', 'customer', 'vendor', 'courier'] as const).map((value) => ({
            value,
            label: portal.roles[value],
          }))}
        />
      </PortalHeader>

      <section className="mb-9 desk:mb-12">
        <DemoFiguresNote text={t.screens.common.demoFigures} />
        <div className="grid grid-cols-2 desk:grid-cols-4 gap-3.5 desk:gap-5">
          <StatSticker label={t.admin.platformGMV} value={formatCurrency(48290)} tint="gift" />
          <StatSticker label={t.admin.activeMerchants} value={`38 ${t.admin.storesCount}`} hint={t.admin.inDistricts} tint="food" />
          <StatSticker label={t.admin.couriersOnShift} value={`24 ${t.admin.onLine}`} tint="tech" />
          <StatSticker label={t.admin.avgDeliveryTime} value={`27.4 ${t.admin.minLabel}`} tint="health" />
        </div>
      </section>

      <section className="mb-9 desk:mb-12">
        <SectionHeading note={portal.applications} title={t.admin.merchantApplications} />
        <ul className="grid desk:grid-cols-3 gap-4">
          {stores.map((store) => {
            const isApproved = statuses[store.id] === 'approved';
            return (
              <Panel key={store.id} as="li" className="flex flex-col">
                <Stamp tone={isApproved ? 'success' : 'warn'} className="self-start">
                  {isApproved ? t.admin.statusVerified : t.admin.statusPending}
                </Stamp>
                <h3 className="mt-2 text-lg font-black leading-snug">{store.name}</h3>
                <p className="flex-1 mb-3 text-sm font-bold text-ink-2">
                  {store.category} · {store.address}
                </p>
                {isApproved ? (
                  <p className="flex items-center gap-1.5 min-h-11 text-sm font-extrabold text-success">
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0" />
                    {t.admin.activeInCatalog}
                  </p>
                ) : (
                  <Button size="sm" onClick={() => handleApproveStore(store.id)} className="self-start whitespace-normal">
                    {t.admin.approveAndPublish}
                  </Button>
                )}
              </Panel>
            );
          })}
        </ul>
      </section>

      {/* Logo management is restricted to the admin role (RLS on the Supabase side). */}
      <BrandAssetsManager />
    </PageShell>
  );
};
