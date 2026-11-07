import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronLeft, Leaf, MapPin, MessageSquare, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { usePromotions } from '../context/PromotionsContext';
import { useShare } from '../hooks/useShare';
import { pathFor } from '../router/paths';
import { NotFoundView } from './NotFoundPage';
import { FACT_LABELS, ProductLabel, filterProductsByLabels, isLive, visiblePromotions } from '../data/promotions';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { GROUP_TINT_CLASS, groupOfCategoryName, tiltFor } from '../data/collageCatalog';
import { CollageGroupId } from '../i18n/collage';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';
import { IconButton } from '../components/ui/IconButton';
import { BottomPanel } from '../components/collage/BottomPanel';
import { CategoryChip } from '../components/collage/CategoryChip';
import { FACT_LABEL_ICON } from '../components/collage/ProductLabelChips';
import { EmptyState } from '../components/ui/EmptyState';
import { PageShell, SectionHeading } from '../components/collage/Page';
import { PolaroidPhoto } from '../components/collage/PolaroidPhoto';
import { PromotionSticker } from '../components/collage/PromotionSticker';
import { Stamp } from '../components/collage/Stamp';
import { Tape } from '../components/collage/Tape';

const FACT = 'min-w-0 px-3 py-2 border-2 border-ink rounded-xl';

export const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams();
  const { deliveryFor, setIsAddressModalOpen, addToCart, updateCartQuantity, cart, cartTotalCount, cartSubtotal, openChatWithParticipant } = useApp();
  const { language, t, formatCurrency, formatTimeRange, formatDistance } = useLanguage();
  const share = useShare();
  const { promotions, now, labelsFor } = usePromotions();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [requiredLabels, setRequiredLabels] = useState<ProductLabel[]>([]);

  const store = useMemo(() => MOCK_STORES.find((s) => s.id === storeId), [storeId]);
  const storeProducts = useMemo(() => MOCK_PRODUCTS.filter((p) => p.storeId === storeId), [storeId]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    storeProducts.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    const inCategory =
      selectedCategory === 'all' ? storeProducts : storeProducts.filter((p) => p.category === selectedCategory);
    return filterProductsByLabels(inCategory, requiredLabels, labelsFor);
  }, [storeProducts, selectedCategory, requiredLabels, labelsFor]);

  const toggleRequiredLabel = (label: ProductLabel) =>
    setRequiredLabels((prev) => (prev.includes(label) ? prev.filter((entry) => entry !== label) : [...prev, label]));

  const getInCartQuantity = (productId: string) => cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  if (!store) {
    return <NotFoundView title={t.demo.notFound.storeTitle} description={t.demo.notFound.storeDesc} />;
  }

  const copy = t.collage.storeCopy[store.id];
  const displayName = copy?.name || store.names?.[language] || store.name;
  const displayKind = copy?.kind || store.categories?.[language] || store.category;
  const displayAddress = store.addresses?.[language] || store.address;
  const delivery = deliveryFor(store.id);
  const shownPromotions = visiblePromotions(promotions, store.id, now);

  const categoryLabel = (name: string) =>
    MOCK_CATEGORIES.find((c) => c.name === name)?.names?.[language] || name;

  const handleShare = () => share({ title: displayName, path: pathFor('store', { storeId: store.id }) });

  const openStoreChat = () =>
    openChatWithParticipant({
      type: 'store',
      id: store.id,
      name: displayName,
      avatarUrl: store.logoUrl,
      storeId: store.id,
    });

  return (
    <PageShell>
      <Link
        to={pathFor('catalog')}
        className="inline-flex items-center gap-1 min-h-11 -ms-1 px-1 font-extrabold cursor-pointer hover:underline"
      >
        <ChevronLeft aria-hidden="true" className="w-5 h-5 rtl-flip" />
        {t.store.backToCatalog}
      </Link>

      <section className="grid desk:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 desk:gap-12 items-center mt-3 mb-9 desk:mb-14">
        <div
          className="anim-drop relative w-full max-w-[420px] mx-auto bg-card p-3 pb-5 shadow-polaroid"
          style={{ rotate: tiltFor(store.id) }}
        >
          <Tape tone="yellow" />
          <PolaroidPhoto src={store.coverUrl} alt={displayName} aspectClassName="aspect-[4/3]" eager />
          <p className="hand mt-2.5 text-[30px] leading-none">{displayKind}</p>
        </div>

        <div className="min-w-0">
          <p className="hand anim-in inline-block text-[26px] desk:text-[30px] leading-tight text-action -rotate-2">
            {t.screens.store.note}
          </p>
          <h1 className="anim-in font-black tracking-[-0.03em] leading-[1.02] text-[clamp(32px,4.6vw,60px)] break-words">
            <bdi>{displayName}</bdi>
          </h1>
          <p className="flex items-start gap-1.5 mt-2 font-bold text-ink-2">
            <MapPin aria-hidden="true" className="w-4 h-4 mt-1 shrink-0" />
            <span>{displayAddress}</span>
          </p>

          {store.isEco && (
            <div className="mt-3">
              <Stamp tone="success">
                <Leaf aria-hidden="true" className="inline w-3.5 h-3.5 me-1 -mt-0.5" />
                {t.storeCard.eco}
              </Stamp>
            </div>
          )}

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className={`${FACT} bg-tint-health`}>
              <dt className="text-xs font-bold text-ink-2">{t.store.courierDeliveryLabel}</dt>
              <dd className="font-black tabular-nums">{formatTimeRange(delivery.timeMin, delivery.timeMax)}</dd>
            </div>
            <div className={`${FACT} bg-tint-food`}>
              <dt className="text-xs font-bold text-ink-2">{t.store.deliveryCostLabel}</dt>
              <dd className="font-black tabular-nums">{formatCurrency(store.deliveryFee)}</dd>
            </div>
            <div className={`${FACT} bg-tint-pets`}>
              <dt className="text-xs font-bold text-ink-2">{t.store.minOrderPrefix}</dt>
              <dd className="font-black tabular-nums">{formatCurrency(store.minOrder)}</dd>
            </div>
            <div className={`${FACT} bg-tint-gift`}>
              <dt className="text-xs font-bold text-ink-2">{t.screens.store.distance}</dt>
              <dd className="font-black tabular-nums">{formatDistance(delivery.km)}</dd>
            </div>
          </dl>

          {!delivery.inRange && (
            <div role="status" className="mt-4 p-3 bg-tint-food border-2 border-ink rounded-xl">
              <p className="font-black">{t.demo.delivery.outOfRange}</p>
              <p className="text-sm font-bold">
                {t.demo.delivery.outOfRangeDesc
                  .replace('{distance}', formatDistance(delivery.km))
                  .replace('{radius}', formatDistance(store.deliveryRadiusKm))}
              </p>
              <Button variant="secondary" size="sm" onClick={() => setIsAddressModalOpen(true)} className="mt-2">
                {t.demo.delivery.changeAddress}
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <Button
              variant="outline"
              leftIcon={<MessageSquare aria-hidden="true" className="w-4 h-4" />}
              onClick={openStoreChat}
            >
              {t.chat.withStore}
            </Button>
            <IconButton
              onClick={handleShare}
              aria-label={t.store.shareStore}
              title={t.store.shareStore}
              icon={<Share2 aria-hidden="true" className="w-4 h-4" />}
            />
          </div>
        </div>
      </section>

      {shownPromotions.length > 0 && (
        <section className="mb-9 desk:mb-14">
          <SectionHeading note={t.promotions.shop.note} title={t.promotions.shop.title} />
          <ul className="grid sm:grid-cols-2 desk:grid-cols-3 gap-4 pt-2">
            {shownPromotions.map((promotion) => (
              <li key={promotion.id}>
                <PromotionSticker promotion={promotion} isRunningNow={isLive(promotion, now)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <SectionHeading title={`${t.store.storeAssortment} (${filteredProducts.length})`} />

      {categories.length > 2 && (
        <div
          role="group"
          aria-label={t.store.storeAssortment}
          className="scroll-row flex desk:flex-wrap gap-2 -mx-4 px-4 desk:mx-0 desk:px-0 pb-4 overflow-x-auto desk:overflow-visible"
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat === 'all' ? t.catalog.allProducts : categoryLabel(cat)}
              isActive={selectedCategory === cat}
              tintClassName={GROUP_TINT_CLASS[(groupOfCategoryName(cat) as CollageGroupId) ?? 'all'] ?? 'bg-card'}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      )}

      <div
        role="group"
        aria-label={t.promotions.filters.label}
        className="scroll-row flex desk:flex-wrap gap-2 -mx-4 px-4 desk:mx-0 desk:px-0 pb-4 overflow-x-auto desk:overflow-visible"
      >
        {FACT_LABELS.map((label) => (
          <CategoryChip
            key={label}
            label={t.promotions.labels[label]}
            icon={FACT_LABEL_ICON[label]}
            isActive={requiredLabels.includes(label)}
            onClick={() => toggleRequiredLabel(label)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title={t.promotions.filters.emptyTitle}
          description={t.promotions.filters.emptyDesc}
          actionText={t.promotions.filters.reset}
          onAction={() => setRequiredLabels([])}
        />
      ) : (
        <div className="product-grid pt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQuantity={getInCartQuantity(product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateCartQuantity}
            />
          ))}
        </div>
      )}

      {cartTotalCount > 0 && (
        <BottomPanel
          note={t.screens.store.inBasket}
          title={
            <span className="tabular-nums">
              {cartTotalCount} · {formatCurrency(cartSubtotal)}
            </span>
          }
        >
          <LinkButton to={pathFor('cart')} size="lg" className="whitespace-nowrap px-3.5 desk:px-6">
            {t.screens.store.toBasket}
          </LinkButton>
        </BottomPanel>
      )}
    </PageShell>
  );
};
