import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { PRODUCT_LABELS } from '../../data/promotions';
import { Button } from '../ui/Button';
import { CategoryChip } from '../collage/CategoryChip';
import { Panel } from '../collage/Panel';
import { SectionHeading } from '../collage/Page';

/** The seller picks each product's labels from the fixed list. */
export const ProductLabelManager: React.FC<{ storeId: string }> = ({ storeId }) => {
  const { language, t, formatCurrency } = useLanguage();
  const { labelsFor, toggleProductLabel, resetProductLabels } = usePromotions();
  const copy = t.promotions.seller;

  return (
    <section>
      <SectionHeading
        note={copy.labelsNote}
        title={copy.labelsTitle}
        aside={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw aria-hidden="true" className="w-4 h-4" />}
            onClick={resetProductLabels}
          >
            {copy.resetLabels}
          </Button>
        }
      />
      <p className="mb-3 font-bold text-ink-2">{copy.labelsHint}</p>
      <ul className="grid desk:grid-cols-2 gap-4">
        {MOCK_PRODUCTS.filter((product) => product.storeId === storeId).map((product) => {
          const name = product.names?.[language] || product.name;
          const labels = labelsFor(product.id);
          return (
            <Panel key={product.id} as="li">
              <h3 className="font-black leading-snug break-words">{name}</h3>
              <p className="text-sm font-bold text-ink-2">
                {product.units?.[language] || product.unit} · {formatCurrency(product.price)}
              </p>
              <div role="group" aria-label={`${copy.labelsTitle}: ${name}`} className="flex flex-wrap gap-2 mt-2.5">
                {PRODUCT_LABELS.map((label) => (
                  <CategoryChip
                    key={label}
                    label={t.promotions.labels[label]}
                    isActive={labels.includes(label)}
                    onClick={() => toggleProductLabel(product.id, label)}
                  />
                ))}
              </div>
            </Panel>
          );
        })}
      </ul>
    </section>
  );
};
