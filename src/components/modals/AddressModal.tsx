import React, { useState } from 'react';
import { Building, Home, MapPin, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HandCheck } from '../collage/HandMarks';
import { Stamp } from '../collage/Stamp';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const AddressModal: React.FC = () => {
  const { isAddressModalOpen, setIsAddressModalOpen, currentAddress, setCurrentAddress, currentUser } = useApp();
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
      <div className="space-y-3">
        <ul className="space-y-2.5">
          {currentUser.savedAddresses.map((addr) => {
            const displayTitle = addr.titles?.[language] || addr.title;
            const displayAddress = addr.addresses?.[language] || addr.address;
            const isSelected = currentAddress === addr.address || currentAddress === displayAddress;

            return (
              <li key={addr.id}>
                <button
                  type="button"
                  onClick={() => handleSelectAddress(displayAddress)}
                  aria-pressed={isSelected}
                  className={`chip-tilt flex items-start gap-3 w-full p-3 text-start border-2 border-ink rounded-2xl cursor-pointer ${
                    isSelected ? 'bg-tint-gift shadow-hard-3' : 'bg-card'
                  }`}
                >
                  {addr.id === 'addr-1' ? (
                    <Home aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <Building aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-black">{displayTitle}</span>
                      {addr.isDefault && <Stamp>{t.address.primaryBadge}</Stamp>}
                    </span>
                    <span className="block mt-0.5 text-sm font-bold text-ink-2 break-words">{displayAddress}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative shrink-0 w-6 h-6 mt-0.5 border-[2.5px] border-ink rounded-md"
                  >
                    {isSelected && <HandCheck />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {isAddingNew ? (
          <form onSubmit={handleSaveCustom} className="space-y-3 pt-1">
            <Input
              label={t.address.newAddressTitle}
              placeholder={t.address.inputPlaceholder}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" className="flex-1">
                {t.address.applyBtn}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsAddingNew(false)}>
                {t.address.cancelBtn}
              </Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center gap-2 w-full min-h-11 px-4 py-2 border-2 border-dashed border-ink rounded-2xl font-extrabold cursor-pointer hover:bg-tint-pets"
          >
            <Plus aria-hidden="true" className="w-4 h-4 shrink-0" />
            {t.address.otherAddressBtn}
          </button>
        )}
      </div>
    </Modal>
  );
};
