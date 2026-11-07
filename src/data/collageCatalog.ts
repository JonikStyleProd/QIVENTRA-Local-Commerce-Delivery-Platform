import { CollageGroupId } from '../i18n/collage';
import { MOCK_CATEGORIES } from './mockData';

/** Chip order on the shop picker. "all" means no category filter. */
export const COLLAGE_GROUPS: CollageGroupId[] = ['all', 'food', 'health', 'gift', 'tech', 'pets'];

export const GROUP_TINT_CLASS: Record<CollageGroupId, string> = {
  all: 'bg-white',
  food: 'bg-tint-food',
  health: 'bg-tint-health',
  gift: 'bg-tint-gift',
  tech: 'bg-tint-tech',
  pets: 'bg-tint-pets',
};

/** The design shows fewer chips than the data has categories; "sports" has no chip and no shops. */
const SLUG_TO_GROUP: Record<string, string> = {
  grocery: 'food',
  bakery: 'food',
  pharmacy: 'health',
  flowers: 'gift',
  home: 'gift',
  electronics: 'tech',
  pets: 'pets',
  sports: 'sports',
};

/** Accepts either a chip id or a data category slug, because both reach the shared filter state. */
export const groupFromSlug = (slug: string | null): string => {
  if (!slug) return 'all';
  return SLUG_TO_GROUP[slug] ?? slug;
};

/** Stores and products keep their category as the category's name in the data. */
export const groupOfCategoryName = (categoryName: string): string | undefined => {
  const category = MOCK_CATEGORIES.find((c) => c.name === categoryName);
  return category ? SLUG_TO_GROUP[category.slug] : undefined;
};

const STICKER_TILTS = ['-3deg', '2deg', '-1.5deg', '3deg', '-2deg', '1.5deg'];

/** Stable tilt for a card: same item, same angle, on every render and in every list. */
export const tiltFor = (id: string): string => {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return STICKER_TILTS[sum % STICKER_TILTS.length];
};
