import type { PlayerState, BannerState } from './types';

const STORAGE_KEY = 'gacha.save.v1';

const DEFAULT_STATE: PlayerState = {
  currency: { gems: 1600 },
  inventory: {},
  bannerStateById: {},
};

export function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as PlayerState;
    // Basic shape validation
    if (!parsed || typeof parsed !== 'object') return structuredClone(DEFAULT_STATE);
    if (!parsed.currency || typeof parsed.currency.gems !== 'number') parsed.currency = { gems: 0 } as PlayerState['currency'];
    if (!parsed.inventory || typeof parsed.inventory !== 'object') parsed.inventory = {};
    if (!parsed.bannerStateById || typeof parsed.bannerStateById !== 'object') parsed.bannerStateById = {} as PlayerState['bannerStateById'];
    return parsed;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state: PlayerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence errors (e.g., private mode)
  }
}

export function ensureBannerState(state: PlayerState, bannerId: string): BannerState {
  if (!state.bannerStateById[bannerId]) {
    state.bannerStateById[bannerId] = {
      pityCounters: { fiveStar: 0, fourStar: 0 },
      failedFeatured: { fiveStar: false, fourStar: false },
    };
  }
  return state.bannerStateById[bannerId];
}

export function addGems(state: PlayerState, amount: number): PlayerState {
  const next = structuredClone(state);
  next.currency.gems = Math.max(0, next.currency.gems + amount);
  return next;
}

export function addToInventory(state: PlayerState, itemId: string, amount = 1): PlayerState {
  const next = structuredClone(state);
  next.inventory[itemId] = (next.inventory[itemId] ?? 0) + amount;
  return next;
}