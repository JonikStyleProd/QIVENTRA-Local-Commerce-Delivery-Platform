import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronLeft, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { useShare } from '../hooks/useShare';
import { pathFor } from '../router/paths';
import { IconButton } from '../components/ui/IconButton';
import { PageHeading, PageShell } from '../components/collage/Page';
import { ProductDetails } from '../components/collage/ProductDetails';
import { NotFoundView } from './NotFoundPage';

export const ProductPage: React.FC = () => {
  const { storeId, productId } = useParams();
  const { language, t } = useLanguage();
  const share = useShare();

  const store = useMemo(() => MOCK_STORES.find((candidate) => candidate.id === storeId), [storeId]);
  const product = useMemo(
    () => MOCK_PRODUCTS.find((candidate) => candidate.id === productId && candidate.storeId === storeId),
    [productId, storeId]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [productId]);

  if (!store) {
    return <NotFoundView title={t.demo.notFound.storeTitle} description={t.demo.notFound.storeDesc} />;
  }
  if (!product) {
    return (
      <NotFoundView
        title={t.demo.notFound.productTitle}
        description={t.demo.notFound.productDesc}
        actionText={t.demo.notFound.toStore}
        actionTo={pathFor('store', { storeId: store.id })}
      />
    );
  }

  const name = product.names?.[language] || product.name;
  const storeName = t.collage.storeCopy[store.id]?.name || store.names?.[language] || store.name;

  return (
    <PageShell width="narrow">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={pathFor('store', { storeId: store.id })}
          className="inline-flex items-center gap-1 min-h-11 -ms-1 px-1 font-extrabold cursor-pointer hover:underline"
        >
          <ChevronLeft aria-hidden="true" className="w-5 h-5 rtl-flip" />
          <bdi>{storeName}</bdi>
        </Link>
        <IconButton
          onClick={() => share({ title: name, path: pathFor('product', { storeId: store.id, productId: product.id }) })}
          aria-label={t.demo.share.product}
          title={t.demo.share.product}
          icon={<Share2 aria-hidden="true" className="w-4 h-4" />}
        />
      </div>
      <PageHeading
        note={t.collage.storeCopy[store.id]?.kind ?? ''}
        title={name}
        className="mt-1 mb-5"
      />
      <ProductDetails key={product.id} product={product} />
    </PageShell>
  );
};
