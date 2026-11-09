import { useEffect, useState } from 'react';
import { BANKAI } from './data/bankai';
import { Reveal } from './components/Reveal';
import { Forge } from './components/Forge';

type Mode = 'roster' | 'forge';

export default function App() {
  const [mode, setMode] = useState<Mode>('roster');
  const [i, setI] = useState(0);
  const active = BANKAI[i];

  useEffect(() => {
    if (new URLSearchParams(location.search).has('forge')) setMode('forge');
  }, []);

  if (mode === 'forge'){
    return <Forge onExit={() => {setMode('roster'); history.replaceState(null, '', location.pathname); }}/>;
  }

  return (
    <main>
      <Reveal key={active.id} bankai={active} />
      <nav className="strip">
        {BANKAI.map((b, idx) => (
          <button
            key={b.id}
            className={idx === i ? 'chip is-active' : 'chip'}
            style={{ ['--accent' as string]: b.accent }}
            onClick={() => setI(idx)}
          >
            <strong>{b.bankai.en}</strong>
            <em>{b.user}</em>
          </button>
        ))}
        <button
          className='chip chip--forge'
          style={{ ['--accent' as string]: '#ff2b4a'}}
          onClick={() => { setMode('forge'); history.replaceState(null, '', location.pathname); }}
        >
          <strong>⚡ Forge your own</strong>
          <em>become the blade</em>
        </button>
      </nav>
    </main>
  );
}