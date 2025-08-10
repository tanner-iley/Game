import type { Banner, PlayerState, PullOutcome, Rarity } from './types';
import { ensureBannerState, addToInventory } from './storage';

function randomChoice<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

function getNonFeaturedPool(allItems: { fiveStar: any[]; fourStar: any[] }, rarity: Rarity, featuredIds: Set<string> | null) {
  if (rarity === 5) {
    return featuredIds
      ? allItems.fiveStar.filter((i) => !featuredIds.has(i.id))
      : allItems.fiveStar;
  }
  if (rarity === 4) {
    return featuredIds
      ? allItems.fourStar.filter((i) => !featuredIds.has(i.id))
      : allItems.fourStar;
  }
  return [];
}

export interface RollOptions {
  rng?: () => number;
}

export function rollOnce(state: PlayerState, banner: Banner, options: RollOptions = {}): { state: PlayerState; outcome: PullOutcome } {
  const rng = options.rng ?? Math.random;
  const nextState = structuredClone(state);
  const bannerState = ensureBannerState(nextState, banner.id);

  // Increment pity counters before rolling
  bannerState.pityCounters.fiveStar += 1;
  bannerState.pityCounters.fourStar += 1;

  let rarity: Rarity;
  let pityTriggered = false;

  // Hard pity for 5*
  if (bannerState.pityCounters.fiveStar >= banner.pity.fiveStar) {
    rarity = 5;
    pityTriggered = true;
  } else {
    // Base roll
    const roll = rng();
    if (roll < banner.rates.fiveStar) {
      rarity = 5;
    } else if (roll < banner.rates.fiveStar + banner.rates.fourStar) {
      rarity = 4;
    } else {
      rarity = 3;
    }

    // Apply 4* pity upgrade (only if not already 5*)
    if (rarity !== 5 && bannerState.pityCounters.fourStar >= banner.pity.fourStar) {
      rarity = 4;
      pityTriggered = true;
    }
  }

  // Reset pity based on hit rarity
  if (rarity === 5) {
    bannerState.pityCounters.fiveStar = 0;
    bannerState.pityCounters.fourStar = 0; // In many games, 4* pity resets on 5*
  } else if (rarity === 4) {
    bannerState.pityCounters.fourStar = 0;
  }

  // Determine featured
  let isFeatured = false;
  let itemPool;
  if (rarity === 5) {
    const featuredIds = new Set(banner.featured?.fiveStar ?? []);
    const hasFeatured = featuredIds.size > 0;
    const guaranteedFeatured = !!banner.featured?.featuredGuarantee && bannerState.failedFeatured.fiveStar;
    if (hasFeatured && (guaranteedFeatured || rng() < 0.5)) {
      isFeatured = true;
      const featuredPool = banner.pool.fiveStar.filter((i) => featuredIds.has(i.id));
      itemPool = featuredPool.length > 0 ? featuredPool : banner.pool.fiveStar;
      bannerState.failedFeatured.fiveStar = false;
    } else {
      const nonFeaturedPool = getNonFeaturedPool({ fiveStar: banner.pool.fiveStar, fourStar: banner.pool.fourStar }, 5, hasFeatured ? featuredIds : null);
      itemPool = nonFeaturedPool.length > 0 ? nonFeaturedPool : banner.pool.fiveStar;
      if (hasFeatured && banner.featured?.featuredGuarantee) {
        bannerState.failedFeatured.fiveStar = true;
      }
    }
  } else if (rarity === 4) {
    const featuredIds = new Set(banner.featured?.fourStar ?? []);
    const hasFeatured = featuredIds.size > 0;
    const guaranteedFeatured = !!banner.featured?.featuredGuarantee && bannerState.failedFeatured.fourStar;
    if (hasFeatured && (guaranteedFeatured || rng() < 0.5)) {
      isFeatured = true;
      const featuredPool = banner.pool.fourStar.filter((i) => featuredIds.has(i.id));
      itemPool = featuredPool.length > 0 ? featuredPool : banner.pool.fourStar;
      bannerState.failedFeatured.fourStar = false;
    } else {
      const nonFeaturedPool = getNonFeaturedPool({ fiveStar: banner.pool.fiveStar, fourStar: banner.pool.fourStar }, 4, hasFeatured ? featuredIds : null);
      itemPool = nonFeaturedPool.length > 0 ? nonFeaturedPool : banner.pool.fourStar;
      if (hasFeatured && banner.featured?.featuredGuarantee) {
        bannerState.failedFeatured.fourStar = true;
      }
    }
  } else {
    itemPool = banner.pool.threeStar;
  }

  const item = randomChoice(itemPool, rng);

  // Add to inventory
  const updatedState = addToInventory(nextState, item.id, 1);

  const outcome: PullOutcome = {
    item,
    rarity,
    isFeatured,
    pityTriggered,
  };

  return { state: updatedState, outcome };
}

export function rollMany(state: PlayerState, banner: Banner, count: number, options: RollOptions = {}): { state: PlayerState; outcomes: PullOutcome[] } {
  let current = state;
  const outcomes: PullOutcome[] = [];
  for (let i = 0; i < count; i += 1) {
    const r = rollOnce(current, banner, options);
    current = r.state;
    outcomes.push(r.outcome);
  }
  return { state: current, outcomes };
}