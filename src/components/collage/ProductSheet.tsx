import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { ProductDetails } from './ProductDetails';

interface ProductSheetProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

/** The product window. It remounts on each opening, so the variant choice starts fresh. */
export const ProductSheet: React.FC<ProductSheetProps> = ({ product, isOpen, onClose }) => {
  const { language } = useLanguage();
  const name = product.names?.[language] || product.name;
  const storeName = product.storeNames?.[language] || product.storeName;

  return (
    <Modal isOpen={isOpen} onClose={onClose} note={storeName} title={name} maxWidth="lg">
      {isOpen && <ProductDetails product={product} onLeave={onClose} showPageLink />}
    </Modal>
  );
};
