export type Rarity = 3 | 4 | 5;

export type ItemType = 'character' | 'weapon';

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  type: ItemType;
}

export interface BannerRates {
  fiveStar: number; // probability from 0 to 1
  fourStar: number; // probability from 0 to 1
  threeStar: number; // probability from 0 to 1
}

export interface BannerPityConfig {
  fiveStar: number; // hard pity threshold for 5*
  fourStar: number; // hard pity threshold for 4*
}

export interface BannerFeaturedConfig {
  fiveStar?: string[]; // item ids
  fourStar?: string[]; // item ids
  // If true, after losing featured at a given rarity, the next hit at that rarity is guaranteed featured
  featuredGuarantee?: boolean;
}

export interface BannerPool {
  fiveStar: Item[];
  fourStar: Item[];
  threeStar: Item[];
}

export interface Banner {
  id: string;
  name: string;
  description?: string;
  rates: BannerRates;
  pity: BannerPityConfig;
  featured?: BannerFeaturedConfig;
  pool: BannerPool;
}

export interface PullOutcome {
  item: Item;
  rarity: Rarity;
  isFeatured: boolean;
  pityTriggered: boolean;
}

export interface BannerState {
  pityCounters: {
    fiveStar: number;
    fourStar: number;
  };
  failedFeatured: {
    fiveStar: boolean; // true if last fiveStar was non-featured and next should be guaranteed featured (if enabled)
    fourStar: boolean; // same as above for fourStar
  };
}

export interface PlayerState {
  currency: {
    gems: number;
  };
  inventory: Record<string, number>; // itemId -> count
  bannerStateById: Record<string, BannerState>;
}

export const PULL_COST_GEMS = 160;