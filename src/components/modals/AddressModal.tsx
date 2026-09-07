import React, { useState } from 'react';
import { MapPin, Check, Plus, Home, Building } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    currentAddress,
    setCurrentAddress,
    currentUser,
  } = useApp();

  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [customInput, setCustomInput] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSelectAddress = (address: string) => {
    setCurrentAddress(address);
    setIsAddressModalOpen(false);
    showToast({
      type: 'info',
      title: t.address.modalTitle,
      message: address,
    });
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setCurrentAddress(customInput.trim());
    setIsAddressModalOpen(false);
    setCustomInput('');
    setIsAddingNew(false);
    showToast({
      type: 'success',
      title: t.address.newAddressTitle,
      message: customInput.trim(),
    });
  };

  return (
    <Modal
      isOpen={isAddressModalOpen}
      onClose={() => setIsAddressModalOpen(false)}
      title={t.address.modalTitle}
      subtitle={t.address.modalSubtitle}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Saved Addresses List */}
        <div className="space-y-2">
          {currentUser.savedAddresses.map((addr) => {
            const displayTitle = addr.titles?.[language] || addr.title;
            const displayAddress = addr.addresses?.[language] || addr.address;
            const isSelected = currentAddress === addr.address || currentAddress === displayAddress;

            return (
              <div
                key={addr.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectAddress(displayAddress)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectAddress(displayAddress);
                  }
                }}
                className={`
                  flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none
                  ${
                    isSelected
                      ? 'border-[#123B35] dark:border-[#B8D96B] bg-[#123B35]/5 dark:bg-[#B8D96B]/10 ring-1 ring-[#B8D96B]'
                      : 'border-theme hover:bg-surface-elevated'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817]'
                        : 'bg-surface-elevated text-secondary'
                    }`}
                  >
                    {addr.id === 'addr-1' ? (
                      <Home className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{displayTitle}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-secondary border border-theme">
                          {t.address.primaryBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-1">{displayAddress}</p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B] shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Add custom address input */}
        {isAddingNew ? (
          <form onSubmit={handleSaveCustom} className="space-y-3 pt-2">
            <Input
              label={t.address.newAddressTitle}
              placeholder={t.address.inputPlaceholder}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <div className="flex items-center gap-2">
              <Button type="submit" variant="primary" size="md" fullWidth>
                {t.address.applyBtn}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsAddingNew(false)}
              >
                {t.address.cancelBtn}
              </Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 px-4 rounded-2xl border border-dashed border-theme hover:border-primary text-xs font-semibold text-secondary hover:text-primary flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.address.otherAddressBtn}</span>
          </button>
        )}
      </div>
    </Modal>
  );
};
