import type { Banner, Item } from '../game/types';

const fiveStarItems: Item[] = [
  { id: 'c_aurora', name: 'Aurora', rarity: 5, type: 'character' },
  { id: 'c_zephyr', name: 'Zephyr', rarity: 5, type: 'character' },
  { id: 'w_starseer', name: 'Starseer', rarity: 5, type: 'weapon' },
];

const fourStarItems: Item[] = [
  { id: 'c_rin', name: 'Rin', rarity: 4, type: 'character' },
  { id: 'c_kai', name: 'Kai', rarity: 4, type: 'character' },
  { id: 'w_moonblade', name: 'Moonblade', rarity: 4, type: 'weapon' },
  { id: 'w_dawnbow', name: 'Dawnbow', rarity: 4, type: 'weapon' },
];

const threeStarItems: Item[] = [
  { id: 'w_iron_sword', name: 'Iron Sword', rarity: 3, type: 'weapon' },
  { id: 'w_bronze_lance', name: 'Bronze Lance', rarity: 3, type: 'weapon' },
  { id: 'w_ash_bow', name: 'Ash Bow', rarity: 3, type: 'weapon' },
  { id: 'w_oak_staff', name: 'Oak Staff', rarity: 3, type: 'weapon' },
  { id: 'w_leather_dagger', name: 'Leather Dagger', rarity: 3, type: 'weapon' },
];

export const standardBanner: Banner = {
  id: 'standard',
  name: 'Starlight Standard Banner',
  description: 'A balanced banner with a chance to obtain characters and weapons. 5★ pity at 90, 4★ pity at 10. Featured guarantee system applies.',
  rates: {
    fiveStar: 0.006, // 0.6%
    fourStar: 0.051, // 5.1%
    threeStar: 0.943, // 94.3%
  },
  pity: {
    fiveStar: 90,
    fourStar: 10,
  },
  featured: {
    fiveStar: ['c_aurora'],
    fourStar: ['c_rin', 'w_moonblade'],
    featuredGuarantee: true,
  },
  pool: {
    fiveStar: fiveStarItems,
    fourStar: fourStarItems,
    threeStar: threeStarItems,
  },
};

export const ALL_ITEMS: Record<string, Item> = [...fiveStarItems, ...fourStarItems, ...threeStarItems].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, Item>);