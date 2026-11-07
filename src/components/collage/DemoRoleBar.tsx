import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { pathFor } from '../../router/paths';
import { AppRoute, UserProfile } from '../../types';
import { LinkButton } from '../ui/LinkButton';
import { SegmentedControl } from './SegmentedControl';
import { Stamp } from './Stamp';

const ROLE_HOME: Record<UserProfile['role'], AppRoute> = {
  customer: 'home',
  vendor: 'vendor',
  courier: 'courier',
  admin: 'admin',
};

/** Top of every workspace: says that roles are a demo, leads back to the shop, and holds the role switch. */
export const DemoRoleBar: React.FC<{ current: 'vendor' | 'courier' | 'admin' }> = ({ current }) => {
  const { navigateTo, setDemoRole } = useApp();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const portal = t.screens.portal;
  const copy = t.demo.portal;

  return (
    <aside
      aria-label={copy.badge}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 mb-5 p-3 bg-tint-gift border-2 border-dashed border-ink rounded-2xl"
    >
      <div className="min-w-0 flex-[1_1_280px]">
        <Stamp tone="action">{copy.badge}</Stamp>
        <p className="mt-1 text-sm font-bold">{copy.desc}</p>
      </div>
      <SegmentedControl<UserProfile['role']>
        label={copy.roleSwitcher}
        value={current}
        onChange={(role) => {
          setDemoRole(role);
          showToast({
            type: 'info',
            title: portal.roleChangedTitle,
            message: portal.roleChangedMsg.replace('{role}', portal.roles[role]),
          });
          navigateTo(ROLE_HOME[role]);
        }}
        options={(['customer', 'vendor', 'courier', 'admin'] as const).map((value) => ({
          value,
          label: portal.roles[value],
        }))}
      />
      <LinkButton to={pathFor('home')} variant="outline" size="sm">
        {copy.backToShop}
      </LinkButton>
    </aside>
  );
};
