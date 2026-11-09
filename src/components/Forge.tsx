import { useEffect, useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import {
    forgeBankai,
    type Element,
    type ForgeInput,
    type Temperament,
    type Weapon,
} from '../lib/forge';

const ELEMENTS: {value: Element; label: string; glyph: string}[] = [
    { value: 'fire',   label: 'Flame',  glyph: '炎' },
  { value: 'ice',    label: 'Ice',    glyph: '氷' },
  { value: 'storm',  label: 'Storm',  glyph: '雷' },
  { value: 'shadow', label: 'Shadow', glyph: '影' },
  { value: 'light',  label: 'Light',  glyph: '光' },
  { value: 'void',   label: 'Void',   glyph: '無' },
  { value: 'blood',  label: 'Blood',  glyph: '血' },
  { value: 'flower', label: 'Flower', glyph: '花' },
];

const WEAPONS: { value: Weapon; label: string; glyph: string}[] = [
    { value: 'blade',  label: 'Blade',  glyph: '剣' },
  { value: 'spear',  label: 'Spear',  glyph: '槍' },
  { value: 'bow',    label: 'Bow',    glyph: '弓' },
  { value: 'chain',  label: 'Chain',  glyph: '鎖' },
  { value: 'mirror', label: 'Mirror', glyph: '鏡' },
  { value: 'bell',   label: 'Bell',   glyph: '鐘' },
  { value: 'claw',   label: 'Claw',   glyph: '爪' },
  { value: 'wing',   label: 'Wing',   glyph: '翼' },
];

const TEMPERAMENTS: { value: Temperament; label: string; glyph: string }[] = [
  { value: 'noble',   label: 'Noble',   glyph: '貴' },
  { value: 'savage',  label: 'Savage',  glyph: '蛮' },
  { value: 'solemn',  label: 'Solemn',  glyph: '厳' },
  { value: 'playful', label: 'Playful', glyph: '戯' },
  { value: 'void',    label: 'Void',    glyph: '虚' },
];

function readForgeFromURL(): ForgeInput | null {
    const raw = new URLSearchParams(location.search).get('forge');
    if (!raw) return null;
    try {
        const p = JSON.parse(raw);
        if (typeof p?.seed !== 'number' || !p.element || !p.weapon || !p.temperament) return null;
        return p as ForgeInput;
    } catch {
        return null;
    }
}

export function Forge({onExit}: {onExit?: () => void}) {
    const [name, setName] = useState('');
    const [element, setElement] = useState<Element>('fire');
    const [weapon, setWeapon] = useState<Weapon>('blade');
    const [temperament, setTemperament] = useState<Temperament>('noble');
    const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
    const [forged, setForged] = useState<ForgeInput | null>(readForgeFromURL);

    useEffect(() => {
        if(!forged) return;
        const url = new URL(location.href);
        url.searchParams.set('forge', JSON.stringify(forged));
        history.replaceState(null, '', url);
    }, [forged]);

    const preview = useMemo(
        () => forgeBankai({name, element, weapon, temperament, seed}),
        [name, element, weapon, temperament, seed],
    );

    // console.log(preview.bankai);

    const forge = () => setForged({name, element, weapon, temperament, seed});

    const reforge = () => {
        const nextSeed = Math.floor(Math.random() * 1e9);
        setSeed(nextSeed);
        setForged({ name, element, weapon, temperament, seed: nextSeed});
    };

    const copyLink = async () => {
        if(!forged) return;
        const url = new URL(location.href);
        url.searchParams.set('forge', JSON.stringify(forged));
        try{
            await navigator.clipboard.writeText(url.toString());
        } catch {
            // ignore
        }
    };

    if (forged) {
        const bankai = forgeBankai(forged);
        return (
            <div className="forge-result">
                <Reveal bankai={bankai} />
                <div className="forge-actions">
                    <button onClick={reforge}>Reforege</button>
                    <button onClick={copyLink}>Copy Link</button>
                    <button onClick={() => { setForged(null); history.replaceState(null, '', location.pathname); }}>← Back</button>
                    <button>{onExit && <button onClick={onExit}>Roster</button>}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="forge">
            <div className="forge-header">
                <h1>FORGE</h1>
                <p>Tell the blade what you are. It will do the rest.</p>
            </div>

            <div className="forge-form">
                <label className="forge-field">
                    <span>Your name</span>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="the soul who will wield it"
                        maxLength={32}
                        autoComplete="off"
                        />
                </label>

                <div className="forge-group">
                    <div className="forge-group-label">Element</div>
                    <div className="forge-choices">
                        {ELEMENTS.map((e) => (
                            <button
                                key={e.value}
                                type="button"
                                className={e.value === element ? 'choice is-active' : 'choice'}
                                onClick={() => setElement(e.value)}
                            >
                                <span className="glyph">{e.glyph}</span>
                                <span className="label">{e.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="forge-group">
                    <div className="forge-group-label">Weapon</div>
                    <div className="forge-choices">
                        {WEAPONS.map((w) => (
                            <button
                                key={w.value}
                                type="button"
                                className={w.value === weapon ? 'choice is-active' : 'choice'}
                                onClick={() => setWeapon(w.value)}
                            >
                                <span className="glyph">{w.glyph}</span>
                                <span className="label">{w.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="forge-group">
                    <div className="forge-group-label">Temperament</div>
                    <div className="forge-choices">
                        {TEMPERAMENTS.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                className={t.value === temperament ? 'choice is-active' : 'choice'}
                                onClick={() => setTemperament(t.value)}
                            >
                                <span className="glyph">{t.glyph}</span>
                                <span className="label">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="forge-preview" style={{ ['--accent' as string]: preview.accent }}>
                    <div className="preview-label">Preview</div>
                    <div className="preview-jp">{preview.bankai.jp}</div>
                    <div className="preview-en">{preview.bankai.en}</div>
                    <div className="preview-romanji">{preview.bankai.romaji}</div>
                </div>

                <div className="forge-actions forge-actions--inline">
                    <button className="forge-button" type="button" onClick={forge}>FORGE BANKAI</button>
                    <button className="forge-button forge-button--ghost" type="button" onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>
                        ⟲ New seed
                    </button>
                    {onExit && (
                        <button className="forge-button forge-button--ghost" type="button" onClick={onExit}>
                            Roster
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}