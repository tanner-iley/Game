import { useMemo } from 'react';
import type { PlayerState } from '../game/types';
import { ALL_ITEMS } from '../data/banners';

interface Props {
  state: PlayerState;
}

export function Inventory({ state }: Props) {
  const entries = useMemo(() => {
    const rows = Object.entries(state.inventory)
      .map(([itemId, count]) => ({ item: ALL_ITEMS[itemId], count }))
      .filter((r) => !!r.item);
    rows.sort((a, b) => (b.item.rarity - a.item.rarity) || a.item.name.localeCompare(b.item.name));
    return rows;
  }, [state.inventory]);

  if (entries.length === 0) {
    return <div style={{ opacity: 0.8 }}>No items yet. Try a pull!</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
      {entries.map(({ item, count }) => (
        <div key={item.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 8, background: '#121212' }}>
          <div style={{ fontWeight: 600 }}>{item.name} <span style={{ opacity: 0.8 }}>({item.rarity}★)</span></div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{item.type}</div>
          <div><strong>x{count}</strong></div>
        </div>
      ))}
    </div>
  );
}

export default Inventory;