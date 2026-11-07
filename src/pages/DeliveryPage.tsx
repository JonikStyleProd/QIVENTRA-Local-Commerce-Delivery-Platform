import React, { useEffect, useId, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { HandCheck } from '../components/collage/HandMarks';
import { PolaroidPhoto } from '../components/collage/PolaroidPhoto';
import { StepHeader } from '../components/collage/StepHeader';
import { Tape } from '../components/collage/Tape';
import { focusPageHeading } from '../components/collage/focusHeading';

type Phase = 'form' | 'busy' | 'done';

const SENDING_TIME_MS = 1200;

/** Step 2 of the path: delivery window (N9-Delivery / M9-Delivery) with its form, sending and done states. */
export const DeliveryPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    totalAmount,
    currentAddress,
    selectedStore,
    orderStores,
    setIsAddressModalOpen,
    navigateTo,
  } = useApp();
  const { language, t, formatCurrency, formatTimeRange, formatDistance } = useLanguage();
  const copy = t.collage.delivery;

  const [slot, setSlot] = useState(0);
  const [note, setNote] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const timer = useRef<number | undefined>(undefined);
  const noteId = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (phase === 'done') focusPageHeading();
  }, [phase]);

  const isDone = phase === 'done';
  const isBusy = phase === 'busy';

  // The shop on the polaroid: the picked one when it is part of the order, otherwise the first in it.
  const headStore = orderStores.find((line) => line.store.id === selectedStore?.id)?.store ?? orderStores[0]?.store;
  const shortfalls = orderStores.filter((line) => line.shortfall > 0);
  const canConfirm = shortfalls.length === 0;

  const storeTime = orderStores.length
    ? formatTimeRange(
        Math.min(...orderStores.map((line) => line.store.deliveryTimeMin)),
        Math.max(...orderStores.map((line) => line.store.deliveryTimeMax))
      )
    : '';
  const slots = t.collage.slots.map((s, index) => ({ ...s, hint: index === 0 ? `≈ ${storeTime}` : s.hint }));
  const currentSlot = slots[slot];

  const storeName = (id: string, fallback: string) => t.collage.storeCopy[id]?.name || fallback;
  const pickedName = headStore ? storeName(headStore.id, headStore.names?.[language] || headStore.name) : '';
  const pickedCopy = headStore ? t.collage.storeCopy[headStore.id] : undefined;

  // The basket is not limited to one shop, so the order goes to all of its shops.
  const cartStoreNames = orderStores.map((line) =>
    storeName(line.store.id, line.store.names?.[language] || line.store.name)
  );

  const totalLabel = formatCurrency(totalAmount);
  const feeLabel = formatCurrency(deliveryFee);

  const itemSummary = cart
    .map((line) => {
      const label =
        t.collage.productLabels[line.product.id] || line.product.names?.[language] || line.product.name;
      return line.quantity > 1 ? `${line.quantity} × ${label}` : label;
    })
    .join(', ');

  const confirm = () => {
    if (phase !== 'form' || !canConfirm) return;
    setPhase('busy');
    timer.current = window.setTimeout(() => setPhase('done'), SENDING_TIME_MS);
  };

  const backToStores = () => navigateTo('catalog');

  const [sentBefore, sentAfter] = copy.sent.split('{store}');
  const sentLine = (
    <>
      {sentBefore}
      <bdi>{cartStoreNames.join(', ')}</bdi>
      {sentAfter}
    </>
  );

  if (cart.length === 0 && !isDone) {
    return (
      <div className="paper-dots min-h-screen pb-16">
        <StepHeader step={copy.step} title={copy.title} backLabel={copy.backMobile} onBack={backToStores} />
        <div className="hidden desk:block max-w-[1200px] mx-auto px-10 pt-8 pb-6">
          <h1 className="text-[46px] font-black tracking-[-0.02em]">{copy.title}</h1>
        </div>
        <div className="px-4 pt-6">
          <EmptyState
            title={t.cart.emptyTitle}
            description={t.cart.emptyDesc}
            actionText={t.collage.landing.toShops}
            onAction={backToStores}
          />
        </div>
      </div>
    );
  }

  const windowLine = `${copy.windowWord}: ${currentSlot.label}`;

  const form = (
    <div>
      <p className="hand text-[26px] desk:text-[28px] leading-[44px] text-link">{copy.when}</p>
      <div role="radiogroup" aria-label={copy.windowLabel}>
        {slots.map((s, index) => {
          const isOn = slot === index;
          return (
            <label
              key={s.label}
              className="notebook-row flex items-center gap-3 desk:gap-3.5 min-h-11 desk:px-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="delivery-window"
                checked={isOn}
                disabled={isBusy}
                onChange={() => setSlot(index)}
                className="peer sr-only"
              />
              <span className="relative shrink-0 w-6 h-6 desk:w-[26px] desk:h-[26px] border-[2.5px] border-ink rounded-md peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-link">
                {isOn && <HandCheck />}
              </span>
              <span className="hand text-2xl desk:text-[30px] leading-none">{s.label}</span>
              <span className="text-xs desk:text-[15px] font-extrabold desk:font-bold text-ink-4">{s.hint}</span>
            </label>
          );
        })}
      </div>

      <label htmlFor={noteId} className="hand block text-2xl desk:text-[28px] leading-[44px] text-link">
        {copy.note}
      </label>
      <input
        id={noteId}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isBusy}
        placeholder={copy.notePh}
        className="hand w-full h-11 px-1.5 bg-transparent border-b-2 border-dashed border-ink text-2xl desk:text-[28px] placeholder:text-ink-3"
      />

      <p className="hand mt-1 text-2xl desk:text-[28px] leading-[44px] text-link">{copy.where}</p>
      <div className="flex flex-wrap items-center justify-between gap-x-3 pb-1">
        <p className="min-w-0 font-bold leading-[22px]">{currentAddress}</p>
        <button
          type="button"
          onClick={() => setIsAddressModalOpen(true)}
          disabled={isBusy}
          className="min-w-11 min-h-11 text-sm font-extrabold underline cursor-pointer"
        >
          {t.cart.changeAddress}
        </button>
      </div>
    </div>
  );

  const minOrderNotice = (id: string) =>
    !isDone && !canConfirm ? (
      <ul id={id} className="grid gap-1 mb-2.5 text-sm font-extrabold">
        {shortfalls.map((line) => {
          const [before, after] = copy.addMore
            .replace('{n}', formatCurrency(line.shortfall))
            .replace('{min}', formatCurrency(line.store.minOrder))
            .split('{store}');
          return (
            <li key={line.store.id}>
              {before}
              <bdi>{storeName(line.store.id, line.store.name)}</bdi>
              {after}{' '}
              <button
                type="button"
                onClick={() => navigateTo('store', { storeId: line.store.id })}
                className="inline-flex items-center min-h-11 font-black underline cursor-pointer"
              >
                {copy.toStoreItems}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  const stamp = (className: string) => (
    <span
      aria-hidden="true"
      className={`anim-stamp absolute bg-white/90 border-action text-action font-black tracking-[0.04em] ${className}`}
    >
      {copy.stamp}
    </span>
  );

  const doneActions = (
    <>
      <Button variant="secondary" size="lg" onClick={() => navigateTo('home')}>
        {copy.home}
      </Button>
      <Button variant="outline" size="lg" onClick={() => setPhase('form')}>
        {copy.change}
      </Button>
    </>
  );

  return (
    <div className="paper-dots min-h-screen desk:pb-[70px]">
      <StepHeader
        step={isDone ? copy.done : copy.step}
        title={isDone ? copy.titleDoneMobile : copy.title}
        backLabel={copy.backMobile}
        onBack={backToStores}
      />

      <div className="hidden desk:flex justify-between items-center gap-4 max-w-[1200px] mx-auto px-10 pt-5 pb-2">
        <button
          type="button"
          onClick={backToStores}
          className="inline-flex items-center min-h-11 px-1 font-extrabold cursor-pointer hover:underline"
        >
          {copy.back}
        </button>
      </div>

      <section className="grid desk:grid-cols-2 gap-10 items-start max-w-[1200px] mx-auto px-4 desk:px-10 pt-3 desk:pt-2.5 pb-5">
        {/* ---------- Notebook page ---------- */}
        <div
          className={`anim-page relative bg-white border-2 border-ink rounded-md shadow-hard-5 desk:shadow-hard-8 py-4 desk:py-[34px] ps-[46px] desk:ps-[70px] pe-3.5 desk:pe-[34px] [background-image:repeating-linear-gradient(transparent_0_43px,var(--color-notebook-line)_43px_44px)] [background-position:0_16px] desk:[background-position:0_30px] ${
            isDone ? 'hidden desk:block' : ''
          }`}
        >
          <span aria-hidden="true" className="absolute inset-y-0 start-8 desk:start-[50px] w-0.5 bg-notebook-margin" />

          <p className="hand hidden desk:block text-[30px] leading-[44px] text-action">{isDone ? copy.done : copy.step}</p>
          <h1 className="hidden desk:block mb-2 text-[46px] font-black tracking-[-0.02em] leading-[1.05]">
            {isDone ? copy.titleDone : copy.title}
          </h1>

          {isDone ? (
            <div role="status" className="anim-in relative">
              <p className="text-[19px] font-bold leading-[44px]">
                {windowLine} ({currentSlot.hint})
              </p>
              <p className="text-[19px] font-bold leading-[44px]">
                {currentAddress} · {totalLabel}
              </p>
              <p className="text-[19px] font-bold leading-[44px]">
                {sentLine}
              </p>
              {note && (
                <p className="hand text-[28px] leading-[44px]">
                  {copy.note} {note}
                </p>
              )}
              <p className="hand text-[28px] leading-[44px] text-link">{copy.packing}</p>
              {stamp('end-0 bottom-[66px] px-[26px] py-3.5 border-[5px] rounded-2xl text-[34px]')}
              <div className="flex flex-wrap gap-3 mt-[140px]">{doneActions}</div>
            </div>
          ) : (
            form
          )}
        </div>

        {/* ---------- Phone: done screen ---------- */}
        {isDone && (
          <div role="status" className="anim-in desk:hidden">
            <div className="relative mx-1 mt-3.5 mb-[30px] bg-white p-2.5 pb-3.5 rotate-2 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.5)]">
              <Tape tone="blue" small />
              <PolaroidPhoto src="/photos/doorstep-handoff.webp" alt={copy.photoAlt} aspectClassName="aspect-[4/3]" eager />
              <p className="hand mt-2 text-[26px] leading-none">{copy.soon}</p>
              {stamp('-end-1.5 top-[30%] px-4 py-2.5 border-4 rounded-xl text-[26px]')}
            </div>
            <p className="mb-1 text-lg font-black">
              {sentLine}
            </p>
            <p className="mb-1 font-bold text-ink-2">
              {windowLine} · {currentAddress} · {totalLabel}
            </p>
            {note && (
              <p className="hand mb-1 text-2xl">
                {copy.note} {note}
              </p>
            )}
            <div className="grid gap-2.5 mt-4">{doneActions}</div>
          </div>
        )}

        {/* ---------- Desktop: order column ---------- */}
        <aside aria-label={copy.orderLabel} className="hidden desk:block relative pt-5">
          <div className="relative mb-[30px] bg-white p-3.5 pb-5 rotate-2 shadow-[0_24px_36px_-22px_rgba(0,0,0,0.55)]">
            <Tape tone="blue" />
            {isDone ? (
              <>
                <PolaroidPhoto src="/photos/doorstep-handoff.webp" alt={copy.photoAlt} aspectClassName="aspect-[16/10]" eager />
                <p className="hand mt-2.5 text-[34px] leading-none">{copy.soon}</p>
              </>
            ) : (
              <>
                <PolaroidPhoto src={headStore?.coverUrl} alt={pickedName} aspectClassName="aspect-[16/10]" eager />
                <p className="hand mt-2.5 text-[34px] leading-none">
                  <bdi>{pickedName}</bdi>
                </p>
                {headStore && (
                  <p className="mt-1 font-bold text-ink-2">
                    {pickedCopy?.area ? `${pickedCopy.area} · ` : ''}
                    {formatDistance(headStore.distanceKm)} · {formatTimeRange(headStore.deliveryTimeMin, headStore.deliveryTimeMax)}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="px-6 py-[22px] bg-accent border-[3px] border-ink rounded-[22px] shadow-hard-6">
            <ul className="grid gap-2.5 mb-3.5">
              {cart.map((line) => {
                const name = line.product.names?.[language] || line.product.name;
                return (
                  <li key={line.product.id} className="flex items-center gap-3">
                    {line.product.imageUrl && (
                      <img
                        src={line.product.imageUrl}
                        alt=""
                        className="shrink-0 w-[50px] h-[50px] rounded-full object-cover border-[3px] border-white"
                      />
                    )}
                    <span className="flex-1 min-w-0 font-extrabold leading-tight">
                      {name}
                      {line.quantity > 1 ? ` × ${line.quantity}` : ''}
                      <span className="block text-[13px] font-bold">
                        <bdi>{storeName(line.product.storeId, line.product.storeNames?.[language] || line.product.storeName)}</bdi>
                      </span>
                    </span>
                    <span className="font-black whitespace-nowrap">
                      {formatCurrency(line.product.price * line.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {cartDiscount > 0 && (
              <>
                <p className="flex justify-between mb-1 font-bold">
                  <span>{t.cart.itemsSubtotal}</span>
                  <span className="whitespace-nowrap">{formatCurrency(cartSubtotal)}</span>
                </p>
                <p className="flex justify-between mb-1 font-bold">
                  <span>{t.cart.promoDiscount}</span>
                  <span className="whitespace-nowrap">− {formatCurrency(cartDiscount)}</span>
                </p>
              </>
            )}
            {orderStores.length > 1 ? (
              orderStores.map((line) => (
                <p key={line.store.id} className="flex justify-between gap-2 mb-1 font-bold">
                  <span>
                    {copy.deliveryLabel} · <bdi>{storeName(line.store.id, line.store.name)}</bdi>
                  </span>
                  <span className="whitespace-nowrap">{formatCurrency(line.fee)}</span>
                </p>
              ))
            ) : (
              <p className="flex justify-between mb-1 font-bold">
                <span>{copy.deliveryLabel}</span>
                <span className="whitespace-nowrap">{feeLabel}</span>
              </p>
            )}
            <p className="flex justify-between items-baseline mb-[18px]">
              <span className="text-xl font-black">{copy.total}</span>
              <span className="text-[38px] font-black whitespace-nowrap">{totalLabel}</span>
            </p>
            {minOrderNotice('min-order-desktop')}
            {!isDone && (
              <Button
                size="lg"
                fullWidth
                isLoading={isBusy}
                disabled={!canConfirm}
                aria-describedby={canConfirm ? undefined : 'min-order-desktop'}
                onClick={confirm}
                className="min-h-[60px]"
              >
                {isBusy ? copy.busy : `${copy.confirm} · ${totalLabel}`}
              </Button>
            )}
            <p className="mt-3 text-center text-sm font-bold">{t.collage.common.demo}</p>
          </div>
        </aside>
      </section>

      {/* ---------- Phone: yellow sheet ---------- */}
      {!isDone && (
        <div
          className="anim-sheet desk:hidden sticky bottom-0 z-30 mx-2.5 p-3.5 pb-3 bg-accent border-[3px] border-ink rounded-[22px] shadow-hard-4"
          style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex shrink-0 ps-2">
              {cart.slice(0, 3).map((line) =>
                line.product.imageUrl ? (
                  <img
                    key={line.product.id}
                    src={line.product.imageUrl}
                    alt={line.product.names?.[language] || line.product.name}
                    className="w-[38px] h-[38px] -ms-2 rounded-full object-cover border-2 border-white"
                  />
                ) : null
              )}
            </div>
            <span className="flex-1 min-w-0 text-[13px] font-extrabold leading-tight">
              <bdi>{cartStoreNames.join(', ')}</bdi> · {itemSummary}
            </span>
            <span className="text-[26px] font-black whitespace-nowrap">{totalLabel}</span>
          </div>
          {minOrderNotice('min-order-phone')}
          <Button
            size="lg"
            fullWidth
            isLoading={isBusy}
            disabled={!canConfirm}
            aria-describedby={canConfirm ? undefined : 'min-order-phone'}
            onClick={confirm}
          >
            {isBusy ? copy.busy : copy.confirmMobile}
          </Button>
          <p className="mt-2 text-center text-xs font-bold">
            {t.collage.common.demo} · {t.collage.common.fee} {feeLabel}
          </p>
        </div>
      )}
    </div>
  );
};
