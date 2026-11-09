import type { Bankai, Behavior } from "../data/bankai";

export type Element = 'fire' | 'ice' | 'storm' | 'shadow' | 'light' | 'void' | 'blood' | 'flower';
export type Weapon = 'blade' | 'spear' | 'bow' | 'chain' | 'mirror' | 'bell' | 'claw' | 'wing';
export type Temperament = 'noble' | 'savage' | 'solemn' | 'playful' | 'void';

export type ForgeInput = {
    name: string;
    element: Element;
    weapon: Weapon;
    temperament: Temperament;
    seed: number;
};

type Part = { kanji: string; romaji: string; compoundRomaji?:string; meaning: string };
type RNG = () => number;

const cap = (s:string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const clamp = (n:number) => Math.max(1, Math.min(100, Math.round(n)));
const interpolate = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');

function mulberry32(seed: number): RNG {
    let s= seed >>> 0;
    return () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ELEMENT_PREFIX: Record<Element, Part[]> = {
    fire: [
    { kanji: '炎', romaji: 'en', meaning: 'flame' },
    { kanji: '紅', romaji: 'kurenai', meaning: 'crimson' },
    { kanji: '陽', romaji: 'yō', meaning: 'sun' },
    { kanji: '火', romaji: 'hi', meaning: 'fire' },
    { kanji: '焔', romaji: 'homura', meaning: 'blaze' },
  ],
  ice: [
    { kanji: '氷', romaji: 'kōri', compoundRomaji: 'hyō', meaning: 'ice' },
    { kanji: '雪', romaji: 'yuki', meaning: 'snow' },
    { kanji: '白', romaji: 'shiro', compoundRomaji: 'haku', meaning: 'white' },
    { kanji: '霜', romaji: 'shimo', meaning: 'frost' },
    { kanji: '冷', romaji: 'rei', meaning: 'cold' },
  ],
  storm: [
    { kanji: '雷', romaji: 'rai', meaning: 'thunder' },
    { kanji: '風', romaji: 'kaze', compoundRomaji: 'fū', meaning: 'wind' },
    { kanji: '嵐', romaji: 'arashi', meaning: 'storm' },
    { kanji: '空', romaji: 'sora', meaning: 'sky' },
    { kanji: '雲', romaji: 'kumo', meaning: 'cloud' },
  ],
  shadow: [
    { kanji: '影', romaji: 'kage', compoundRomaji: 'ei', meaning: 'shadow' },
    { kanji: '闇', romaji: 'yami', meaning: 'darkness' },
    { kanji: '黒', romaji: 'kuro', meaning: 'black' },
    { kanji: '冥', romaji: 'mei', meaning: 'underworld' },
    { kanji: '夜', romaji: 'yoru', meaning: 'night' },
  ],
  light: [
    { kanji: '光', romaji: 'hikari', compoundRomaji: 'kō', meaning: 'light' },
    { kanji: '陽', romaji: 'yō', meaning: 'sun' },
    { kanji: '金', romaji: 'kin', meaning: 'gold' },
    { kanji: '天', romaji: 'ten', meaning: 'heaven' },
    { kanji: '星', romaji: 'hoshi', compoundRomaji: 'sei', meaning: 'star' },
  ],
  void: [
    { kanji: '無', romaji: 'mu', meaning: 'void' },
    { kanji: '虚', romaji: 'kyo', meaning: 'emptiness' },
    { kanji: '絶', romaji: 'zetsu', meaning: 'severance' },
    { kanji: '夢', romaji: 'yume', meaning: 'dream' },
    { kanji: '終', romaji: 'shū', meaning: 'end' },
  ],
  blood: [
    { kanji: '血', romaji: 'chi', meaning: 'blood' },
    { kanji: '紅', romaji: 'kurenai', meaning: 'crimson' },
    { kanji: '鬼', romaji: 'oni', meaning: 'demon' },
    { kanji: '骨', romaji: 'hone', meaning: 'bone' },
    { kanji: '死', romaji: 'shi', meaning: 'death' },
  ],
  flower: [
    { kanji: '花', romaji: 'hana', compoundRomaji: 'ka', meaning: 'flower' },
    { kanji: '桜', romaji: 'sakura', meaning: 'cherry' },
    { kanji: '華', romaji: 'hana', meaning: 'blossom' },
    { kanji: '蝶', romaji: 'chō', meaning: 'butterfly' },
    { kanji: '薔薇', romaji: 'bara', meaning: 'rose' },
  ],
};

const WEAPON_CORE: Record<Weapon, Part[]> = {
    blade: [
    { kanji: '刃', romaji: 'yaiba', compoundRomaji: 'jin', meaning: 'blade' },
    { kanji: '剣', romaji: 'ken', meaning: 'sword' },
    { kanji: '牙', romaji: 'kiba', compoundRomaji: 'ga', meaning: 'fang' },
    { kanji: '爪', romaji: 'tsume', compoundRomaji: 'sō', meaning: 'claw' },
  ],
  spear: [
    { kanji: '槍', romaji: 'yari', compoundRomaji: 'sō', meaning: 'spear' },
    { kanji: '矛', romaji: 'hoko', meaning: 'halberd' },
    { kanji: '穂', romaji: 'ho', meaning: 'spearhead' },
    { kanji: '牙', romaji: 'kiba', compoundRomaji: 'ga', meaning: 'fang' },
  ],
  bow: [
    { kanji: '弓', romaji: 'yumi', meaning: 'bow' },
    { kanji: '矢', romaji: 'ya', meaning: 'arrow' },
    { kanji: '翼', romaji: 'tsubasa', compoundRomaji: 'yoku', meaning: 'wing' },
    { kanji: '羽', romaji: 'hane', compoundRomaji: 'u', meaning: 'feather' },
  ],
  chain: [
    { kanji: '鎖', romaji: 'kusari', compoundRomaji: 'sa', meaning: 'chain' },
    { kanji: '輪', romaji: 'wa', compoundRomaji: 'rin', meaning: 'ring' },
    { kanji: '絆', romaji: 'kizuna', compoundRomaji: 'han', meaning: 'bond' },
    { kanji: '網', romaji: 'ami', meaning: 'net' },
  ],
  mirror: [
    { kanji: '鏡', romaji: 'kagami', compoundRomaji: 'kyō', meaning: 'mirror' },
    { kanji: '夢', romaji: 'yume', compoundRomaji: 'mu', meaning: 'dream' },
    { kanji: '影', romaji: 'kage', compoundRomaji: 'ei', meaning: 'shadow' },
    { kanji: '顔', romaji: 'kao', meaning: 'face' },
  ],
  bell: [
    { kanji: '鐘', romaji: 'kane', compoundRomaji: 'shō', meaning: 'bell' },
    { kanji: '鈴', romaji: 'suzu', compoundRomaji: 'rei', meaning: 'chime' },
    { kanji: '歌', romaji: 'uta', compoundRomaji: 'ka', meaning: 'song' },
    { kanji: '声', romaji: 'koe', compoundRomaji: 'sei', meaning: 'voice' },
  ],
  claw: [
    { kanji: '爪', romaji: 'tsume', compoundRomaji: 'sō', meaning: 'claw' },
    { kanji: '牙', romaji: 'kiba', compoundRomaji: 'ga', meaning: 'fang' },
    { kanji: '狼', romaji: 'ōkami', compoundRomaji: 'rō', meaning: 'wolf' },
    { kanji: '虎', romaji: 'tora', compoundRomaji: 'ko', meaning: 'tiger' },
  ],
  wing: [
    { kanji: '翼', romaji: 'tsubasa', compoundRomaji: 'yoku', meaning: 'wing' },
    { kanji: '羽', romaji: 'hane', compoundRomaji: 'u', meaning: 'feather' },
    { kanji: '鳥', romaji: 'tori', compoundRomaji: 'chō', meaning: 'bird' },
    { kanji: '鷹', romaji: 'taka', compoundRomaji: 'yō', meaning: 'hawk' },
  ],
};

const TEMPERAMENT_PREFIX: Record<Temperament, Part[]> = {
    noble: [
    { kanji: '天', romaji: 'ten', meaning: 'heaven' },
    { kanji: '月', romaji: 'tsuki', compoundRomaji: 'getsu', meaning: 'moon' },
    { kanji: '光', romaji: 'hikari', compoundRomaji: 'kō', meaning: 'light' },
    { kanji: '白', romaji: 'shiro', compoundRomaji: 'haku', meaning: 'white' },
    { kanji: '聖', romaji: 'sei', meaning: 'holy' },
  ],
  savage: [
    { kanji: '血', romaji: 'chi', meaning: 'blood' },
    { kanji: '鬼', romaji: 'oni', meaning: 'demon' },
    { kanji: '狼', romaji: 'ōkami', compoundRomaji: 'rō', meaning: 'wolf' },
    { kanji: '狂', romaji: 'kyō', meaning: 'madness' },
  ],
  solemn: [
    { kanji: '冥', romaji: 'mei', meaning: 'underworld' },
    { kanji: '骨', romaji: 'hone', compoundRomaji: 'kotsu', meaning: 'bone' },
    { kanji: '墓', romaji: 'haka', compoundRomaji: 'bo', meaning: 'grave' },
    { kanji: '終', romaji: 'shū', meaning: 'end' },
    { kanji: '無', romaji: 'mu', meaning: 'void' },
  ],
  playful: [
    { kanji: '蝶', romaji: 'chō', meaning: 'butterfly' },
    { kanji: '花', romaji: 'hana', compoundRomaji: 'ka', meaning: 'flower' },
    { kanji: '夢', romaji: 'yume', compoundRomaji: 'mu', meaning: 'dream' },
    { kanji: '風', romaji: 'kaze', compoundRomaji: 'fū', meaning: 'wind' },
    { kanji: '遊', romaji: 'yū', meaning: 'play' },
  ],
  void: [
    { kanji: '無', romaji: 'mu', meaning: 'void' },
    { kanji: '闇', romaji: 'yami', meaning: 'darkness' },
    { kanji: '影', romaji: 'kage', compoundRomaji: 'ei', meaning: 'shadow' },
    { kanji: '虚', romaji: 'kyo', meaning: 'emptiness' },
    { kanji: '零', romaji: 'rei', meaning: 'zero' },
  ],
};

const SUFFIX_1: Part[] = [
    { kanji: '丸', romaji: 'maru', meaning: 'ring' },
  { kanji: '斬', romaji: 'zan', meaning: 'slaying' },
  { kanji: '月', romaji: 'getsu', meaning: 'moon' },
  { kanji: '舞', romaji: 'mai', meaning: 'dance' },
  { kanji: '光', romaji: 'kō', meaning: 'light' },
  { kanji: '影', romaji: 'ei', meaning: 'shadow' },
  { kanji: '炎', romaji: 'en', meaning: 'flame' },
  { kanji: '雷', romaji: 'rai', meaning: 'thunder' },
  { kanji: '牙', romaji: 'ga', meaning: 'fang' },
  { kanji: '翼', romaji: 'yoku', meaning: 'wing' },
  { kanji: '神', romaji: 'jin', meaning: 'god' },
  { kanji: '王', romaji: 'ō', meaning: 'king' },
  { kanji: '葬', romaji: 'sō', meaning: 'burial' },
  { kanji: '刃', romaji: 'jin', meaning: 'blade' },
];

const SUFFIX_2: Part[] = [
    { kanji: '太刀', romaji: 'tachi', meaning: 'long sword' },
  { kanji: '乱舞', romaji: 'ranbu', meaning: 'wild dance' },
  { kanji: '神楽', romaji: 'kagura', meaning: 'sacred dance' },
  { kanji: '心中', romaji: 'shinjū', meaning: 'double suicide' },
  { kanji: '無月', romaji: 'mugetsu', meaning: 'moonless' },
  { kanji: '景厳', romaji: 'kageyoshi', meaning: 'solemn view' },
  { kanji: '神殺', romaji: 'kamigoro', meaning: 'god-slaying' },
  { kanji: '氷輪', romaji: 'hyōrin', meaning: 'ice ring' },
  { kanji: '紅蓮', romaji: 'guren', meaning: 'crimson lotus' },
  { kanji: '白霞', romaji: 'shirakasumi', meaning: 'white mist' },
  { kanji: '灰燼', romaji: 'kaijin', meaning: 'ashes' },
  { kanji: '夢幻', romaji: 'mugen', meaning: 'illusion' },
  { kanji: '時雨', romaji: 'shigure', meaning: 'drizzling rain' },
  { kanji: '夕立', romaji: 'yūdachi', meaning: 'evening shower' },
  { kanji: '終焉', romaji: 'shūen', meaning: 'demise' },
  { kanji: '開花', romaji: 'kaika', meaning: 'blossoming' },
  { kanji: '万華', romaji: 'mange', meaning: 'kaleidoscope' },
  { kanji: '天衝', romaji: 'tenshō', meaning: 'heaven-piercer' },
  { kanji: '無双', romaji: 'musō', meaning: 'peerless' },
  { kanji: '斬月', romaji: 'zangetsu', meaning: 'slaying moon' },
  { kanji: '紅姫', romaji: 'benihime', meaning: 'crimson princess' },
];

const EXTRA_PREFIX: Part[] = [
    { kanji: '千本', romaji: 'senbon', meaning: 'a thousand' },
  { kanji: '残火', romaji: 'zanka', meaning: 'remnant flame' },
  { kanji: '白雪', romaji: 'shirayuki', meaning: 'white snow' },
  { kanji: '紅蓮', romaji: 'guren', meaning: 'crimson lotus' },
];

const ELEMENT_VERBS: Record<Element, string[]> = {
    fire: ['Burn', 'Ignite', 'Consume', 'Rage'],
  ice: ['Freeze', 'Shatter', 'Still', 'Sleep'],
  storm: ['Howl', 'Roar', 'Strike', 'Race'],
  shadow: ['Devour', 'Silence', 'Creep', 'Fade'],
  light: ['Shine', 'Blind', 'Bloom', 'Judge'],
  void: ['Erase', 'End', 'Forget', 'Vanish'],
  blood: ['Bleed', 'Hunger', 'Feast', 'Drain'],
  flower: ['Bloom', 'Scatter', 'Dance', 'Whisper'],
}

const ELEMENT_IMAGE: Record<Element, string> = {
  fire: 'a horizon of blackened ash',
  ice: 'a silence of absolute white',
  storm: 'a sky torn open',
  shadow: 'a hollow where light used to be',
  light: 'a dawn that will not end',
  void: 'a silence that eats its own name',
  blood: 'a river that remembers every throat',
  flower: 'a garden that blooms only when it bleeds',
};

const WEAPON_IMAGE: Record<Weapon, string> = {
  blade: 'a single edge that drinks the sun',
  spear: 'a line drawn from horizon to throat',
  bow: 'a curve that looses the moon',
  chain: 'a binding that fetters even the dead',
  mirror: 'a reflection that wounds the one who looks',
  bell: 'a single note that ends a soul',
  claw: 'a hollow that opens where a hand should be',
  wing: 'a shadow of wings that never touch ground',
};

const LORE_TEMPLATES = [
  'The blade dissolves into {elementImage}. What remains is {nameEn} — {weaponImage}.',
  '{nameEn} is not a weapon. It is {elementImage} wearing the shape of {weaponImage}.',
  'Its release stills the battlefield. {elementImage}. {weaponImage}. Nothing else remains.',
  'To face {nameEn} is to become {elementImage} — and then {weaponImage}, forever.',
];

const ELEMENT_THEME: Record<Element, { accent: string; behavior: Behavior; tone: { freq: number; filter: number; dur: number } }> = {
  fire:   { accent: '#ffb066', behavior: 'ash',      tone: { freq: 55,  filter: 400,  dur: 1.4 } },
  ice:    { accent: '#7fdcff', behavior: 'frost',    tone: { freq: 130, filter: 2400, dur: 1.2 } },
  storm:  { accent: '#b0e0ff', behavior: 'tendrils', tone: { freq: 90,  filter: 1800, dur: 1.1 } },
  shadow: { accent: '#8b5cf6', behavior: 'threads',  tone: { freq: 60,  filter: 800,  dur: 1.3 } },
  light:  { accent: '#fff5a0', behavior: 'bloom',    tone: { freq: 180, filter: 4000, dur: 1.0 } },
  void:   { accent: '#6a6a80', behavior: 'tendrils', tone: { freq: 45,  filter: 300,  dur: 1.6 } },
  blood:  { accent: '#ff2b4a', behavior: 'petals',   tone: { freq: 75,  filter: 600,  dur: 1.2 } },
  flower: { accent: '#ff9ec7', behavior: 'petals',   tone: { freq: 110, filter: 1200, dur: 1.1 } },
};

type StatKey = 'attack' | 'speed' | 'range' | 'reiatsu';
type Bias = Partial<Record<StatKey, number>>;

const ELEMENT_BAIS: Record<Element, Bias> = {
    fire:   { attack: 18, range: 6 },
  ice:    { attack: 8,  range: 14 },
  storm:  { speed: 14,  range: 8 },
  shadow: { speed: 10,  reiatsu: 12 },
  light:  { attack: 10, reiatsu: 12 },
  void:   { attack: 16, reiatsu: 14, speed: -6 },
  blood:  { attack: 20, reiatsu: 6,  range: -4 },
  flower: { attack: 4,  speed: 14,   range: 10 },
};

const WEAPON_BAIS: Record<Weapon, Bias> = {
    blade:  { attack: 12, speed: 6 },
  spear:  { attack: 8,  range: 14 },
  bow:    { range: 20,  speed: 4 },
  chain:  { reiatsu: 12, range: 8 },
  mirror: { reiatsu: 14, speed: 4 },
  bell:   { reiatsu: 18, attack: -4 },
  claw:   { attack: 14, speed: 8 },
  wing:   { speed: 18,  range: 6 },
};

const TEMPERAMENT_BIAS: Record<Temperament, Bias> = {
    noble:   { reiatsu: 12, attack: 4 },
  savage:  { attack: 16,  reiatsu: -4 },
  solemn:  { reiatsu: 14, attack: 4 },
  playful: { speed: 14,   range: 8 },
  void:    { reiatsu: 12, range: 6, speed: -4 },
};

type Composed = { kanji: string, romaji: string, english: string};

const compound = (a: Part, b: Part) => cap(a.romaji + (b.compoundRomaji ?? b.romaji));

function templateA(p: Part, c: Part, s: Part): Composed {
  // console.log(cap(s.romaji));
  return {
    kanji: `${p.kanji}${c.kanji}${s.kanji}`,
    romaji: `${compound(p, c)} ${cap(s.romaji)}`,
    english: `${cap(p.meaning)}-${c.meaning} ${cap(s.meaning)}`,
  };
}

function templateB(p: Part, c: Part, s: Part): Composed {
  // console.log(cap(s.romaji));
  return {
    kanji: `${p.kanji}${c.kanji}の${s.kanji}`,
    romaji: `${compound(p, c)} no ${cap(s.romaji)}`,
    english: `${cap(s.meaning)} of the ${cap(p.meaning)} ${c.meaning}`,
  };
}

function templateD(p: Part, s: Part): Composed {
  // console.log(cap(s.romaji));
  return {
    kanji: `${p.kanji}の${s.kanji}`,
    romaji: `${cap(p.romaji)} no ${cap(s.romaji)}`,
    english: `${cap(s.meaning)} of ${cap(p.meaning)}`,
  };
}

function templateC(p1: Part, c1: Part, s1: Part, p2: Part, c2: Part, s2: Part): Composed {
  return {
    kanji: `${p1.kanji}${c1.kanji}${s1.kanji}：${p2.kanji}${c2.kanji}${s2.kanji}`,
    romaji: `${compound(p1, c1)} ${cap(s1.romaji)}: ${compound(p2, c2)} ${cap(s2.romaji)}`,
    english: `${cap(p1.meaning)} ${c1.meaning}, ${cap(s1.meaning)}: ${cap(p2.meaning)} ${c2.meaning}, ${cap(s2.meaning)}`,
  };
}

export function forgeBankai(input: ForgeInput): Bankai {
  const rng = mulberry32(input.seed);
  const r = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  const prefixes = [...EXTRA_PREFIX, ...ELEMENT_PREFIX[input.element], ...TEMPERAMENT_PREFIX[input.temperament]];
  const cores = WEAPON_CORE[input.weapon];

  const p = r(prefixes);
  const c = r(cores);
  const s = r(SUFFIX_2);

  const template = r(['A', 'A', 'B', 'B', 'C', 'D'] as const);
  let name: Composed;
  if (template === 'A') name = templateA(p, c, s);
  else if(template === 'B') name = templateB(p, c, s);
  else if(template === 'D') name = templateD(p, s);
  else name = templateC(p, c, s, r(prefixes), r(cores), r(SUFFIX_2));

  const shikaiPart = r(SUFFIX_1);
  const shikaiKanji = `${c.kanji}${shikaiPart.kanji}`;
  const shikaiRomaji = cap(c.romaji + shikaiPart.romaji);
  void shikaiKanji;

  const verb = r(ELEMENT_VERBS[input.element]);
  const command = `${verb}, ${shikaiRomaji}`;

  const lore = interpolate(r(LORE_TEMPLATES), {
    nameEn: name.english,
    elementImage: ELEMENT_IMAGE[input.element],
    weaponImage: WEAPON_IMAGE[input.weapon],
  });

  const theme = ELEMENT_THEME[input.element];

  const bias = { ...ELEMENT_BAIS[input.element], ...WEAPON_BAIS[input.weapon], ...TEMPERAMENT_BIAS[input.temperament]};
  const base = 70;
  const jitter = () => Math.floor(rng() * 12) - 6;
  const stats = {
    attack: clamp(base + (bias.attack ?? 0) + jitter()),
    speed: clamp(base + (bias.speed ?? 0) + jitter()),
    range: clamp(base + (bias.range ?? 0) + jitter()),
    reiatsu: clamp(base + (bias.reiatsu ?? 0) + jitter()),
  };

  // console.log(name);

  return {
    id: `forge-${input.seed}`,
    user: input.name.trim() || 'The Nameless',
    shikai: shikaiRomaji,
    command,
    bankai: {
      jp: name.kanji,
      en: name.english,
      romaji: name.romaji,
    },
    lore,
    accent: theme.accent,
    behavior: theme.behavior,
    tone: theme.tone,
    stats,
  };
}