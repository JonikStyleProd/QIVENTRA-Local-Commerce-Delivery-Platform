import React, { useId, useMemo, useState } from 'react';
import { Building, Home, MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { HandCheck } from '../collage/HandMarks';
import { Stamp } from '../collage/Stamp';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { DEMO_ADDRESSES, DemoAddress, addressById, storeDelivery, suggestAddresses } from '../../data/addresses';
import { MOCK_STORES } from '../../data/mockData';
import { formatCount } from '../../i18n/format';

const shopsNear = (address: DemoAddress): number =>
  MOCK_STORES.filter((store) => storeDelivery(store, address.coords).inRange).length;

/** Saved addresses, plus a search over the fixed list of demo streets. Anything else is explained, not accepted. */
export const AddressModal: React.FC = () => {
  const { isAddressModalOpen, setIsAddressModalOpen, currentAddressId, setCurrentAddress, currentUser } = useApp();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const copy = t.demo.address;
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [notFound, setNotFound] = useState(false);
  const listId = useId();
  const inputId = useId();
  const errorId = useId();

  const suggestions = useMemo(() => suggestAddresses(query), [query]);

  const close = () => {
    setIsAddressModalOpen(false);
    setQuery('');
    setActiveIndex(-1);
    setNotFound(false);
  };

  const choose = (address: DemoAddress) => {
    setCurrentAddress(address.id);
    close();
    const near = shopsNear(address);
    showToast({
      type: near > 0 ? 'success' : 'warning',
      title: copy.savedTitleToast,
      message: `${address.label[language]}. ${
        near > 0 ? copy.nearToast.replace('{count}', formatCount(near, t.demo.counts.shopsDeliver, language)) : copy.noneNear
      }`,
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const picked = suggestions[activeIndex];
    if (picked) {
      choose(picked);
    } else if (query.trim() && suggestions.length === 1) {
      choose(suggestions[0]);
    } else {
      setNotFound(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
  };

  const example = DEMO_ADDRESSES[2].label[language];

  return (
    <Modal
      isOpen={isAddressModalOpen}
      onClose={close}
      title={t.address.modalTitle}
      subtitle={t.address.modalSubtitle}
      maxWidth="md"
    >
      <div className="space-y-4">
        {currentUser.savedAddresses.length > 0 && (
          <section aria-label={copy.savedTitle}>
            <ul className="space-y-2.5">
              {currentUser.savedAddresses.map((saved) => {
                const address = addressById(saved.demoAddressId);
                if (!address) return null;
                const isSelected = currentAddressId === address.id;
                return (
                  <li key={saved.id}>
                    <button
                      type="button"
                      onClick={() => choose(address)}
                      aria-pressed={isSelected}
                      className={`chip-tilt flex items-start gap-3 w-full p-3 text-start border-2 border-ink rounded-2xl cursor-pointer ${
                        isSelected ? 'bg-tint-gift shadow-hard-3' : 'bg-card'
                      }`}
                    >
                      {saved.id === 'addr-1' ? (
                        <Home aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
                      ) : (
                        <Building aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-black">{saved.titles?.[language] || saved.title}</span>
                          {saved.isDefault && <Stamp>{t.address.primaryBadge}</Stamp>}
                        </span>
                        <span className="block mt-0.5 text-sm font-bold text-ink-2 break-words">{address.label[language]}</span>
                      </span>
                      <span aria-hidden="true" className="relative shrink-0 w-6 h-6 mt-0.5 border-[2.5px] border-ink rounded-md">
                        {isSelected && <HandCheck />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <form onSubmit={submit} noValidate>
          <label htmlFor={inputId} className="block mb-1 font-black">
            {copy.searchLabel}
          </label>
          <div className="flex items-center gap-2 min-h-11 px-3 bg-card border-2 border-ink rounded-xl focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-focus">
            <MapPin aria-hidden="true" className="w-4 h-4 shrink-0" />
            <input
              id={inputId}
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
              aria-describedby={notFound ? errorId : undefined}
              aria-invalid={notFound || undefined}
              autoComplete="off"
              value={query}
              placeholder={copy.searchPlaceholder}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
                setNotFound(false);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 min-h-10 bg-transparent font-bold outline-none focus-visible:outline-none placeholder:text-ink-3"
            />
          </div>
          {(notFound || (query.trim() && suggestions.length === 0)) && (
            <p id={errorId} role="alert" className="mt-1.5 text-sm font-extrabold text-action-text">
              {suggestions.length === 0 ? copy.notFound.replace('{example}', example) : copy.chooseFromList}
            </p>
          )}
          <p className="mt-1.5 text-sm font-bold text-ink-2">
            {copy.listNote.replace('{count}', formatCount(DEMO_ADDRESSES.length, t.demo.counts.streets, language))}
          </p>
        </form>

        <ul
          id={listId}
          role="listbox"
          aria-label={copy.suggestions}
          className="grid gap-1.5 max-h-[34dvh] overflow-y-auto overscroll-contain"
        >
          {suggestions.map((address, index) => {
            const near = shopsNear(address);
            return (
              <li
                key={address.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={address.id === currentAddressId}
                onClick={() => choose(address)}
                className={`min-h-11 px-3 py-1.5 border-2 rounded-xl cursor-pointer hover:bg-tint-pets ${
                  index === activeIndex ? 'border-ink bg-tint-pets' : 'border-paper-dot bg-card'
                }`}
              >
                <span className="block font-extrabold break-words">{address.label[language]}</span>
                <span className="block text-sm font-bold text-ink-2">
                  {address.district[language]} · {near > 0 ? formatCount(near, t.demo.counts.shops, language) : t.demo.delivery.outOfRange}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
};
