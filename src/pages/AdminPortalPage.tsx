import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { formatCount } from '../i18n/format';
import { Button } from '../components/ui/Button';
import { BrandAssetsManager } from '../components/admin/BrandAssetsManager';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { Panel } from '../components/collage/Panel';
import { PortalHeader } from '../components/collage/PortalHeader';
import { DemoRoleBar } from '../components/collage/DemoRoleBar';
import { Stamp } from '../components/collage/Stamp';
import { DemoFiguresNote, StatSticker } from '../components/collage/StatSticker';

export const AdminPortalPage: React.FC = () => {
  const { language, t, formatCurrency, formatMinutes } = useLanguage();
  const { showToast } = useToast();
  const portal = t.screens.portal;

  // Statuses live apart from the text, so the list follows a language switch.
  const [statuses, setStatuses] = useState<Record<string, 'pending' | 'approved'>>({
    'store-app-1': 'pending',
    'store-app-2': 'approved',
    'store-app-3': 'approved',
  });

  const applications = t.demo.portalData.applications;
  const stores = Object.keys(statuses).map((id) => ({ id, ...applications[id] }));

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
      <DemoRoleBar current="admin" />
      <PortalHeader
        icon={<ShieldCheck className="w-7 h-7 desk:w-9 desk:h-9" />}
        note={t.admin.monitoringCenter}
        title={t.admin.adminHubTitle}
        lead={t.admin.adminHubSubtitle}
      >
      </PortalHeader>

      <section className="mb-9 desk:mb-12">
        <DemoFiguresNote text={t.screens.common.demoFigures} />
        <div className="grid grid-cols-2 desk:grid-cols-4 gap-3.5 desk:gap-5">
          <StatSticker label={t.admin.platformGMV} value={formatCurrency(48290)} tint="gift" />
          <StatSticker label={t.admin.activeMerchants} value={formatCount(38, t.demo.counts.merchants, language)} hint={t.admin.inDistricts} tint="food" />
          <StatSticker label={t.admin.couriersOnShift} value={formatCount(24, t.demo.counts.couriers, language)} tint="tech" />
          <StatSticker label={t.admin.avgDeliveryTime} value={formatMinutes(27)} tint="health" />
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
