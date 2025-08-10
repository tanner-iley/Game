import { useMemo, useState } from 'react';
import type { Banner, PlayerState, PullOutcome, Rarity } from '../game/types';
import { PULL_COST_GEMS } from '../game/types';
import { rollMany } from '../game/gacha';
import { saveState } from '../game/storage';

interface Props {
  banner: Banner;
  state: PlayerState;
  setState: (next: PlayerState) => void;
}

function rarityColor(rarity: Rarity): string {
  switch (rarity) {
    case 5:
      return '#ffb800';
    case 4:
      return '#a971ff';
    default:
      return '#54b4ff';
  }
}

export function GachaBanner({ banner, state, setState }: Props) {
  const [recent, setRecent] = useState<PullOutcome[]>([]);
  const pity = state.bannerStateById[banner.id]?.pityCounters ?? { fiveStar: 0, fourStar: 0 };

  const canPull1 = state.currency.gems >= PULL_COST_GEMS;
  const canPull10 = state.currency.gems >= PULL_COST_GEMS * 10;

  const oddsText = useMemo(() => {
    const r = banner.rates;
    return `5★ ${(r.fiveStar * 100).toFixed(2)}% • 4★ ${(r.fourStar * 100).toFixed(2)}% • 3★ ${(r.threeStar * 100).toFixed(2)}%`;
  }, [banner]);

  function handlePull(count: number) {
    if (count <= 0) return;
    const cost = PULL_COST_GEMS * count;
    if (state.currency.gems < cost) return;

    // Pay cost
    const paid: PlayerState = { ...state, currency: { gems: state.currency.gems - cost } };
    const { state: rolled, outcomes } = rollMany(paid, banner, count);
    setRecent(outcomes);
    setState(rolled);
    saveState(rolled);
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: 12, padding: 16, margin: '16px 0', background: '#1a1a1a' }}>
      <h2 style={{ marginTop: 0 }}>{banner.name}</h2>
      {banner.description && <p style={{ opacity: 0.8, marginTop: 0 }}>{banner.description}</p>}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div><strong>Gems:</strong> {state.currency.gems}</div>
        <div><strong>Pity 5★:</strong> {pity.fiveStar} / {banner.pity.fiveStar}</div>
        <div><strong>Pity 4★:</strong> {pity.fourStar} / {banner.pity.fourStar}</div>
        <div style={{ opacity: 0.8 }}>{oddsText}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => handlePull(1)} disabled={!canPull1}>Pull x1 (-{PULL_COST_GEMS})</button>
        <button onClick={() => handlePull(10)} disabled={!canPull10}>Pull x10 (-{PULL_COST_GEMS * 10})</button>
      </div>

      {recent.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8, opacity: 0.9 }}><strong>Results</strong></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {recent.map((r, idx) => (
              <div key={idx} style={{
                border: '1px solid #333', borderRadius: 8, padding: 8,
                background: '#111', color: rarityColor(r.rarity)
              }}>
                <div style={{ fontWeight: 600 }}>{r.item.name}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{r.item.type}</div>
                <div style={{ fontSize: 12 }}>
                  {r.rarity}★ {r.isFeatured ? '• Featured' : ''} {r.pityTriggered ? '• Pity' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GachaBanner;