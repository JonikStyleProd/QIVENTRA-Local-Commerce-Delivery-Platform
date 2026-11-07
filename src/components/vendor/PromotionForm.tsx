import React, { useId, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../data/mockData';
import {
  Promotion,
  PromotionField,
  PromotionType,
  localizedText,
  israelClock,
  validatePromotion,
} from '../../data/promotions';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { SelectField } from '../ui/SelectField';
import { PromotionSticker } from '../collage/PromotionSticker';
import { SegmentedControl } from '../collage/SegmentedControl';

const TYPES: PromotionType[] = ['percent', 'amount', 'freeDelivery', 'gift', 'productPrice'];
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
  { value: 'he', label: 'עב' },
];

/** The form keeps numbers as typed; they become numbers only for validation and saving. */
interface Draft {
  id: string;
  type: PromotionType;
  title: Promotion['title'];
  description: Promotion['description'];
  percent: string;
  amount: string;
  giftProductId: string;
  productId: string;
  newPrice: string;
  minSubtotal: string;
  productIds: string[];
  categories: string[];
  startsOn: string;
  endsOn: string;
  hoursFrom: string;
  hoursTo: string;
  isPaused: boolean;
}

const addDays = (date: string, days: number) => {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
};

const toDraft = (promotion: Promotion | null): Draft => {
  const today = israelClock(new Date()).date;
  return {
    id: promotion?.id ?? `promo-${Date.now()}`,
    type: promotion?.type ?? 'percent',
    title: promotion?.title ?? {},
    description: promotion?.description ?? {},
    percent: promotion?.percent?.toString() ?? '',
    amount: promotion?.amount?.toString() ?? '',
    giftProductId: promotion?.giftProductId ?? '',
    productId: promotion?.productId ?? '',
    newPrice: promotion?.newPrice?.toString() ?? '',
    minSubtotal: promotion ? String(promotion.minSubtotal) : '0',
    productIds: promotion?.productIds ?? [],
    categories: promotion?.categories ?? [],
    startsOn: promotion?.startsOn ?? today,
    endsOn: promotion?.endsOn ?? addDays(today, 30),
    hoursFrom: promotion?.hoursFrom ?? '',
    hoursTo: promotion?.hoursTo ?? '',
    isPaused: promotion?.isPaused ?? false,
  };
};

const parseNumber = (value: string): number | undefined => (value.trim() === '' ? undefined : Number(value));

const toPromotion = (draft: Draft, storeId: string): Promotion => ({
  id: draft.id,
  storeId,
  type: draft.type,
  title: draft.title,
  description: draft.description,
  percent: draft.type === 'percent' ? parseNumber(draft.percent) : undefined,
  amount: draft.type === 'amount' ? parseNumber(draft.amount) : undefined,
  giftProductId: draft.type === 'gift' ? draft.giftProductId || undefined : undefined,
  productId: draft.type === 'productPrice' ? draft.productId || undefined : undefined,
  newPrice: draft.type === 'productPrice' ? parseNumber(draft.newPrice) : undefined,
  minSubtotal: parseNumber(draft.minSubtotal) ?? 0,
  // A new product price is about that one product, so it has no separate scope.
  productIds: draft.type === 'productPrice' ? [] : draft.productIds,
  categories: draft.type === 'productPrice' ? [] : draft.categories,
  startsOn: draft.startsOn,
  endsOn: draft.endsOn,
  hoursFrom: draft.hoursFrom || undefined,
  hoursTo: draft.hoursTo || undefined,
  isPaused: draft.isPaused,
});

const CHECKBOX_ROW = 'flex items-center gap-2.5 min-h-11 font-bold cursor-pointer';
const CHECKBOX = 'shrink-0 w-5 h-5 accent-action cursor-pointer';

interface PromotionFormProps {
  storeId: string;
  /** The promotion being edited; null creates a new one. */
  promotion: Promotion | null;
  onClose: () => void;
  onSave: (promotion: Promotion) => void;
}

/** Create or edit a promotion, with errors at the fields and a live preview of the buyer's view. */
export const PromotionForm: React.FC<PromotionFormProps> = ({ storeId, promotion, onClose, onSave }) => {
  const { language, t } = useLanguage();
  const copy = t.promotions.seller;
  const descriptionId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [draft, setDraft] = useState<Draft>(() => toDraft(promotion));
  const [textLanguage, setTextLanguage] = useState<Language>(language);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const storeProducts = useMemo(() => MOCK_PRODUCTS.filter((product) => product.storeId === storeId), [storeId]);
  const storeCategories = useMemo(() => Array.from(new Set(storeProducts.map((product) => product.category))), [storeProducts]);

  const current = toPromotion(draft, storeId);
  const allErrors = validatePromotion(current, storeProducts);
  const errors: typeof allErrors = wasSubmitted ? allErrors : {};
  const errorText = (field: PromotionField) => (errors[field] ? t.promotions.errors[errors[field]!] : undefined);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: 'productIds' | 'categories', value: string) =>
    set(key, draft[key].includes(value) ? draft[key].filter((entry) => entry !== value) : [...draft[key], value]);

  const productOptions = storeProducts.map((product) => ({
    value: product.id,
    label: product.names?.[language] || product.name,
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (Object.keys(allErrors).length > 0) {
      // Fields are marked once React has rendered this state.
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    onSave(current);
  };

  const hasErrors = wasSubmitted && Object.keys(allErrors).length > 0;

  return (
    <Modal isOpen onClose={onClose} title={promotion ? copy.formEdit : copy.formNew} maxWidth="xl">
      <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">
        <div>
          <SegmentedControl<Language>
            label={copy.language}
            value={textLanguage}
            onChange={setTextLanguage}
            options={LANGUAGES}
            className="mb-2"
          />
          <div className="space-y-3" dir={textLanguage === 'he' ? 'rtl' : 'ltr'} lang={textLanguage}>
            <Input
              label={copy.fieldTitle}
              value={draft.title[textLanguage] ?? ''}
              onChange={(e) => set('title', { ...draft.title, [textLanguage]: e.target.value })}
              error={errorText('title')}
              maxLength={80}
            />
            <div className="flex flex-col gap-1">
              <label htmlFor={descriptionId} className="text-sm font-extrabold">
                {copy.fieldDescription}
              </label>
              <textarea
                id={descriptionId}
                rows={2}
                maxLength={160}
                value={draft.description[textLanguage] ?? ''}
                onChange={(e) => set('description', { ...draft.description, [textLanguage]: e.target.value })}
                className="w-full px-3 py-2 bg-card text-ink border-2 border-ink rounded-xl font-bold"
              />
            </div>
          </div>
          <p className="mt-1 text-sm font-bold text-ink-2">{copy.titleHint}</p>
        </div>

        <SelectField
          label={copy.fieldType}
          value={draft.type}
          onChange={(e) => set('type', e.target.value as PromotionType)}
          options={TYPES.map((value) => ({ value, label: t.promotions.types[value] }))}
        />

        <div className="grid sm:grid-cols-2 gap-3 items-start">
          {draft.type === 'percent' && (
            <Input
              label={copy.fieldPercent}
              type="number"
              inputMode="numeric"
              min={1}
              max={90}
              value={draft.percent}
              onChange={(e) => set('percent', e.target.value)}
              error={errorText('percent')}
            />
          )}
          {draft.type === 'amount' && (
            <Input
              label={copy.fieldAmount}
              type="number"
              inputMode="decimal"
              min={1}
              value={draft.amount}
              onChange={(e) => set('amount', e.target.value)}
              error={errorText('amount')}
            />
          )}
          {draft.type === 'gift' && (
            <SelectField
              label={copy.fieldGift}
              value={draft.giftProductId}
              onChange={(e) => set('giftProductId', e.target.value)}
              placeholder={copy.choose}
              options={productOptions}
              error={errorText('giftProductId')}
            />
          )}
          {draft.type === 'productPrice' && (
            <>
              <SelectField
                label={copy.fieldProduct}
                value={draft.productId}
                onChange={(e) => set('productId', e.target.value)}
                placeholder={copy.choose}
                options={productOptions}
                error={errorText('productId')}
              />
              <Input
                label={copy.fieldNewPrice}
                type="number"
                inputMode="decimal"
                min={1}
                value={draft.newPrice}
                onChange={(e) => set('newPrice', e.target.value)}
                error={errorText('newPrice')}
              />
            </>
          )}
          <Input
            label={copy.fieldMin}
            type="number"
            inputMode="decimal"
            min={0}
            value={draft.minSubtotal}
            onChange={(e) => set('minSubtotal', e.target.value)}
            error={errorText('minSubtotal')}
          />
        </div>

        {draft.type !== 'productPrice' && (
          <fieldset>
            <legend className="text-sm font-extrabold">{copy.fieldScope}</legend>
            <p className="text-sm font-bold text-ink-2">{copy.scopeHint}</p>
            <div className="grid sm:grid-cols-2 gap-x-4">
              {storeCategories.map((name) => (
                <label key={name} className={CHECKBOX_ROW}>
                  <input
                    type="checkbox"
                    className={CHECKBOX}
                    checked={draft.categories.includes(name)}
                    onChange={() => toggle('categories', name)}
                  />
                  <span className="min-w-0">{MOCK_CATEGORIES.find((c) => c.name === name)?.names?.[language] || name}</span>
                </label>
              ))}
              {productOptions.map((option) => (
                <label key={option.value} className={CHECKBOX_ROW}>
                  <input
                    type="checkbox"
                    className={CHECKBOX}
                    checked={draft.productIds.includes(option.value)}
                    onChange={() => toggle('productIds', option.value)}
                  />
                  <span className="min-w-0">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="grid sm:grid-cols-2 gap-3 items-start">
          <Input
            label={copy.fieldStart}
            type="date"
            value={draft.startsOn}
            onChange={(e) => set('startsOn', e.target.value)}
            error={errorText('startsOn')}
          />
          <Input
            label={copy.fieldEnd}
            type="date"
            value={draft.endsOn}
            onChange={(e) => set('endsOn', e.target.value)}
            error={errorText('endsOn')}
          />
          <Input
            label={copy.fieldHoursFrom}
            type="time"
            value={draft.hoursFrom}
            onChange={(e) => set('hoursFrom', e.target.value)}
          />
          <Input
            label={copy.fieldHoursTo}
            type="time"
            value={draft.hoursTo}
            onChange={(e) => set('hoursTo', e.target.value)}
            error={errorText('hoursTo')}
          />
        </div>
        <p className="text-sm font-bold text-ink-2 -mt-2">{copy.hoursHint}</p>

        <section aria-label={copy.preview}>
          <p className="hand mb-1.5 text-2xl leading-none text-link-text">{copy.preview}</p>
          {localizedText(draft.title, language) ? (
            <div className="max-w-[360px]">
              <PromotionSticker promotion={current} />
            </div>
          ) : (
            <p className="p-3 text-sm font-bold text-ink-2 border-2 border-dashed border-ink rounded-xl">{copy.previewEmpty}</p>
          )}
        </section>

        {hasErrors && (
          <p role="alert" className="text-sm font-extrabold text-danger">
            {copy.fixErrors}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit">{copy.save}</Button>
        </div>
      </form>
    </Modal>
  );
};
