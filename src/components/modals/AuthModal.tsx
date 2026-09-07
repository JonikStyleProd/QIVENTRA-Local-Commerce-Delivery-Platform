import React, { useState } from 'react';
import { Mail, Phone, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    updateUserProfile,
    navigateTo,
  } = useApp();
  const { showToast } = useToast();

  const { t, isRTL } = useLanguage();

  const [role, setRole] = useState<'customer' | 'vendor' | 'courier'>('customer');
  const [identifier, setIdentifier] = useState<string>('+972 54 745 1289');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      updateUserProfile({ role });
      setIsLoading(false);
      setIsAuthModalOpen(false);

      const roleNames = {
        customer: t.auth.roleCustomer,
        vendor: t.auth.roleVendor,
        courier: t.auth.roleCourier,
      };

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
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-surface-elevated border border-theme">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setIdentifier('+972 54 745 1289');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'customer'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {t.auth.roleCustomer}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('vendor');
              setIdentifier('partner@carmel-fresh.co.il');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'vendor'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {t.auth.roleVendor}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('courier');
              setIdentifier('+972 50 312 8840');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'courier'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {t.auth.roleCourier}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <Input
            label={role === 'vendor' ? t.auth.storeEmailLabel : t.auth.phoneLabel}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={
              role === 'vendor' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />
            }
            placeholder={role === 'vendor' ? 'store@qiventra.co.il' : '+972 50 000 0000'}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {t.auth.submitBtn}
          </Button>

          <p className="text-[11px] text-center text-muted flex items-center justify-center gap-1 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E824C] shrink-0" />
            {t.auth.demoNotice}
          </p>
        </form>
      </div>
    </Modal>
  );
};
