import { useEffect, useState } from 'react';
import './App.css';
import { standardBanner } from './data/banners';
import type { PlayerState } from './game/types';
import { loadState, saveState, addGems } from './game/storage';
import GachaBanner from './components/GachaBanner';
import Inventory from './components/Inventory';

function App() {
  const [state, setState] = useState<PlayerState>(() => loadState());

  useEffect(() => {
    // Save on unload as a backup
    const handler = () => saveState(state);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state]);

  function handleReset() {
    const fresh = loadState();
    setState(fresh);
    saveState(fresh);
  }

  function handleAddGems(amount: number) {
    const next = addGems(state, amount);
    setState(next);
    saveState(next);
  }

  return (
    <div className="App" style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h1>Gacha Prototype</h1>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button onClick={() => handleAddGems(1600)}>+1600 Gems</button>
        <button onClick={() => handleAddGems(10000)}>+10k Gems</button>
        <button onClick={handleReset}>Reset Save</button>
      </div>

      <GachaBanner banner={standardBanner} state={state} setState={setState} />

      <h3>Inventory</h3>
      <Inventory state={state} />
    </div>
  );
}

export default App;
