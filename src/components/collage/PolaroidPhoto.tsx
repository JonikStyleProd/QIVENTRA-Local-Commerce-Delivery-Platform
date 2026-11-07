import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface PolaroidPhotoProps {
  src?: string;
  alt?: string;
  /** Tailwind aspect classes, for example "aspect-square desk:aspect-[4/3]". */
  aspectClassName?: string;
  /** Size of the "photo soon" note, as Tailwind text classes. */
  noteClassName?: string;
  eager?: boolean;
  /** How wide the photo is on screen, so the browser can take the smaller copy. */
  sizes?: string;
}

/** Local photos also come as a 480 px copy for cards and phones. */
export const smallPhoto = (src: string): string => src.replace(/^\/photos\/([^/]+\.webp)$/, '/photos/480/$1');

const photoSrcSet = (src: string): string | undefined =>
  smallPhoto(src) === src ? undefined : `${smallPhoto(src)} 480w, ${src} 1024w`;

/** Photo area of a polaroid, including the "no photo" state for missing or broken images. */
export const PolaroidPhoto: React.FC<PolaroidPhotoProps> = ({
  src,
  alt = '',
  aspectClassName = 'aspect-square',
  noteClassName = 'text-[22px] desk:text-[32px]',
  eager = false,
  sizes = '(min-width: 1024px) 320px, 50vw',
}) => {
  const { t } = useLanguage();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showPhoto = Boolean(src) && failedSrc !== src;

  return (
    <span className={`block w-full overflow-hidden bg-tint-pets ${aspectClassName}`}>
      {showPhoto ? (
        <img
          src={src}
          srcSet={src ? photoSrcSet(src) : undefined}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
          className="block w-full h-full object-cover"
        />
      ) : (
        <span className={`hand grid place-items-center h-full p-2 text-center text-ink-3 ${noteClassName}`}>
          {t.collage.common.nophoto}
        </span>
      )}
    </span>
  );
};
