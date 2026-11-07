import React, { useState } from 'react';
import { Pause, Pencil, Play, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePromotions } from '../../context/PromotionsContext';
import { useToast } from '../../context/ToastContext';
import { Promotion, PromotionStatus, localizedText, promotionStatus } from '../../data/promotions';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Panel } from '../collage/Panel';
import { SectionHeading } from '../collage/Page';
import { Stamp } from '../collage/Stamp';
import { promotionBadge, promotionConditions } from '../collage/promotionCopy';
import { PromotionForm } from './PromotionForm';

const STATUS_TONE: Record<PromotionStatus, 'success' | 'warn' | 'neutral'> = {
  active: 'success',
  paused: 'warn',
  scheduled: 'neutral',
  ended: 'neutral',
};

/** The seller's list of a shop's promotions, with every action on them. */
export const PromotionManager: React.FC<{ storeId: string }> = ({ storeId }) => {
  const { language, t } = useLanguage();
  const { promotions, now, savePromotion, deletePromotion, setPromotionPaused, resetPromotions } = usePromotions();
  const { showToast } = useToast();
  const copy = t.promotions.seller;

  // undefined: closed; null: creating; a promotion: editing it.
  const [editing, setEditing] = useState<Promotion | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const storePromotions = promotions.filter((promotion) => promotion.storeId === storeId);

  return (
    <section>
      <SectionHeading
        note={copy.listNote}
        title={copy.listTitle}
        aside={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw aria-hidden="true" className="w-4 h-4" />}
              onClick={() => setIsResetting(true)}
            >
              {copy.resetDemo}
            </Button>
            <Button size="sm" leftIcon={<Plus aria-hidden="true" className="w-4 h-4" />} onClick={() => setEditing(null)}>
              {copy.create}
            </Button>
          </div>
        }
      />

      {storePromotions.length === 0 ? (
        <div className="p-5 text-center border-2 border-dashed border-ink rounded-2xl">
          <p className="hand text-[28px] leading-tight text-action">{copy.empty}</p>
          <p className="font-bold text-ink-2">{copy.emptyHint}</p>
        </div>
      ) : (
        <ul className="grid desk:grid-cols-2 gap-4">
          {storePromotions.map((promotion) => {
            const status = promotionStatus(promotion, now);
            const title = localizedText(promotion.title, language);
            return (
              <Panel key={promotion.id} as="li" className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <Stamp tone={STATUS_TONE[status]}>{t.promotions.statuses[status]}</Stamp>
                  <span className="text-sm font-extrabold text-ink-2">{t.promotions.types[promotion.type]}</span>
                  {(promotion.type === 'percent' || promotion.type === 'amount') && (
                    <span className="text-sm font-black text-action-text">{promotionBadge(promotion, t, language)}</span>
                  )}
                </div>
                <h3 className="mt-1.5 text-lg font-black leading-snug break-words">{title}</h3>
                <ul className="flex-1 mt-1 text-sm font-bold text-ink-2">
                  {promotionConditions(promotion, t, language).map((line) => (
                    <li key={line} className="break-words">
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Pencil aria-hidden="true" className="w-4 h-4" />}
                    onClick={() => setEditing(promotion)}
                    aria-label={`${copy.edit}: ${title}`}
                  >
                    {copy.edit}
                  </Button>
                  {status !== 'ended' && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={
                        promotion.isPaused ? (
                          <Play aria-hidden="true" className="w-4 h-4" />
                        ) : (
                          <Pause aria-hidden="true" className="w-4 h-4" />
                        )
                      }
                      onClick={() => setPromotionPaused(promotion.id, !promotion.isPaused)}
                      aria-label={`${promotion.isPaused ? copy.resume : copy.pause}: ${title}`}
                    >
                      {promotion.isPaused ? copy.resume : copy.pause}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Trash2 aria-hidden="true" className="w-4 h-4" />}
                    onClick={() => setDeleting(promotion)}
                    aria-label={`${copy.remove}: ${title}`}
                  >
                    {copy.remove}
                  </Button>
                </div>
              </Panel>
            );
          })}
        </ul>
      )}

      {editing !== undefined && (
        <PromotionForm
          key={editing?.id ?? 'new'}
          storeId={storeId}
          promotion={editing}
          onClose={() => setEditing(undefined)}
          onSave={(promotion) => {
            savePromotion(promotion);
            setEditing(undefined);
            showToast({ type: 'success', title: copy.savedTitle, message: localizedText(promotion.title, language) });
          }}
        />
      )}

      <Modal isOpen={deleting !== null} onClose={() => setDeleting(null)} title={copy.deleteTitle} maxWidth="sm">
        <p className="font-bold text-ink-2">
          {copy.deleteBody.replace('{title}', deleting ? localizedText(deleting.title, language) : '')}
        </p>
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setDeleting(null)}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (deleting) deletePromotion(deleting.id);
              setDeleting(null);
              showToast({ type: 'info', title: copy.deletedTitle });
            }}
          >
            {copy.remove}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isResetting} onClose={() => setIsResetting(false)} title={copy.resetTitle} maxWidth="sm">
        <p className="font-bold text-ink-2">{copy.resetBody}</p>
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setIsResetting(false)}>
            {t.common.cancel}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetPromotions();
              setIsResetting(false);
              showToast({ type: 'info', title: copy.resetDoneTitle });
            }}
          >
            {copy.resetDemo}
          </Button>
        </div>
      </Modal>
    </section>
  );
};
