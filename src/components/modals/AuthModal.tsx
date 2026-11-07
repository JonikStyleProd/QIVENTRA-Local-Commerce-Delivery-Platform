import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SegmentedControl } from '../collage/SegmentedControl';

type AuthRole = 'customer' | 'vendor' | 'courier';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signIn, navigateTo } = useApp();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [role, setRole] = useState<AuthRole>('customer');
  // Demo sign-in: nothing is checked, so the field starts empty and may stay empty.
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleNames: Record<AuthRole, string> = {
    customer: t.auth.roleCustomer,
    vendor: t.auth.roleVendor,
    courier: t.auth.roleCourier,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      signIn(role);
      setIsLoading(false);
      setIsAuthModalOpen(false);

      showToast({
        type: 'success',
        title: t.auth.roleSwitchedMsg,
        message: roleNames[role],
      });

      if (role === 'vendor') navigateTo('vendor');
      else if (role === 'courier') navigateTo('courier');
      else navigateTo('profile');
    }, 500);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={t.auth.modalTitle}
      subtitle={t.auth.modalSubtitle}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <SegmentedControl
          label={t.demo.auth.roleLabel}
          value={role}
          onChange={(next) => {
            setRole(next);
            setIdentifier('');
          }}
          className="flex w-full"
          options={(['customer', 'vendor', 'courier'] as const).map((value) => ({ value, label: roleNames[value] }))}
        />

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label={role === 'vendor' ? t.auth.storeEmailLabel : t.auth.phoneLabel}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={role === 'vendor' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            placeholder={role === 'vendor' ? t.screens.auth.emailPlaceholder : t.screens.auth.phonePlaceholder}
            dir="ltr"
            className="text-start"
          />

          <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="whitespace-normal">
            {t.auth.submitBtn}
          </Button>

          <p className="text-center text-[13px] font-bold text-ink-2">{t.demo.auth.note}</p>
        </form>
      </div>
    </Modal>
  );
};
