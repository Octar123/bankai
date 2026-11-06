import { useState } from 'react';
import { BANKAI } from './data/bankai';
import { Reveal } from './components/Reveal';

export default function App() {
  const [i, setI] = useState(0);
  const active = BANKAI[i];

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
      </nav>
    </main>
  );
}