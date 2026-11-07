import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_PRODUCTS, MOCK_STORES } from '../data/mockData';
import { Translations, Language } from '../i18n/translations';
import { routeOfPath } from './paths';

const SITE = 'QIVENTRA';

/** The tab's title for an address, in the given language. Unknown ids get the "not found" title. */
export const pageTitle = (pathname: string, t: Translations, language: Language): string => {
  const { route, params } = routeOfPath(pathname);
  const titles = t.demo.titles;

  switch (route) {
    case 'home':
      return t.collage.meta.title;
    case 'store': {
      const store = MOCK_STORES.find((s) => s.id === params.storeId);
      if (!store) return `${titles.notFound} · ${SITE}`;
      return `${t.collage.storeCopy[store.id]?.name || store.names?.[language] || store.name} · ${SITE}`;
    }
    case 'product': {
      const product = MOCK_PRODUCTS.find((p) => p.id === params.productId && p.storeId === params.storeId);
      if (!product) return `${titles.notFound} · ${SITE}`;
      return `${product.names?.[language] || product.name} · ${SITE}`;
    }
    default:
      return `${titles[route]} · ${SITE}`;
  }
};

export const usePageTitle = () => {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = pageTitle(pathname, t, language);
  }, [pathname, t, language]);
};
