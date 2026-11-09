export type Behavior = 'petals' | 'frost' | 'ash' | 'tendrils' | 'threads' | 'bloom';

export type Bankai = {
    id: string;
    user: string;
    shikai: string;
    command: string;
    bankai: {jp: string, en: string; romaji: string};
    lore: string;
    accent: string;
    behavior: Behavior;
    tone: {freq: number; filter: number; dur: number};
    stats: {attack: number; speed: number; range: number; reiatsu: number};
};

export const BANKAI: Bankai[] =  [
    {
    id: 'senbonzakura',
    user: 'Byakuya Kuchiki',
    shikai: 'Senbonzakura',
    command: 'Scatter, Senbonzakura',
    bankai: { jp: '千本桜景厳', en: 'Senbonzakura Kageyoshi', romaji: 'Thousand Blooming Cherry Blossoms' },
    lore: 'Two rows of a thousand blades fall into the earth and rise again as an endless storm of petals.',
    accent: '#ff9ec7',
    behavior: 'petals',
    tone: { freq: 90, filter: 900, dur: 1.1 },
    stats: { attack: 82, speed: 88, range: 95, reiatsu: 78 },
  },
  {
    id: 'hyorinmaru',
    user: 'Tōshirō Hitsugaya',
    shikai: 'Hyōrinmaru',
    command: 'Reign over the frosted heavens, Hyōrinmaru',
    bankai: { jp: '大紅蓮氷輪丸', en: 'Daiguren Hyōrinmaru', romaji: 'Great Crimson Lotus Ice Ring' },
    lore: 'Ice wings and a tail of frost — the sky itself freezes in a hundred-mile radius.',
    accent: '#7fdcff',
    behavior: 'frost',
    tone: { freq: 130, filter: 2400, dur: 1.2 },
    stats: { attack: 80, speed: 84, range: 90, reiatsu: 86 },
  },
  {
    id: 'zanka',
    user: 'Genryūsai Shigekuni Yamamoto',
    shikai: 'Ryūjin Jakka',
    command: 'Reduce all creation to ash, Ryūjin Jakka',
    bankai: { jp: '残火の太刀', en: 'Zanka no Tachi', romaji: 'Longsword of the Remnant Flame' },
    lore: 'All flame drawn into the blade. What remains is not heat — it is the sun, condensed.',
    accent: '#ffb066',
    behavior: 'ash',
    tone: { freq: 55, filter: 400, dur: 1.4 },
    stats: { attack: 100, speed: 70, range: 85, reiatsu: 100 },
  },
  {
    id: 'tensa',
    user: 'Ichigo Kurosaki',
    shikai: 'Zangetsu',
    command: 'Bankai',
    bankai: { jp: '天鎖斬月', en: 'Tensa Zangetsu', romaji: 'Heavenly Chains, Slaying Moon' },
    lore: 'Compression. Everything the blade was, crushed into a single black edge.',
    accent: '#ff4d5e',
    behavior: 'tendrils',
    tone: { freq: 70, filter: 700, dur: 1.0 },
    stats: { attack: 95, speed: 100, range: 45, reiatsu: 92 },
  },
  {
    id: 'katen',
    user: 'Shunsui Kyōraku',
    shikai: 'Katen Kyōkotsu',
    command: 'Flower wind rage, flower god roar',
    bankai: { jp: '花天狂骨枯松心中', en: 'Katen Kyōkotsu: Karamatsu Shinjū', romaji: 'Flower Heaven Mad Bones: Withered Pine Lovers\' Suicide' },
    lore: 'A theater of shared wounds. Four acts. In the final act, both throats are cut — and only one survives.',
    accent: '#b48cff',
    behavior: 'threads',
    tone: { freq: 110, filter: 1200, dur: 1.5 },
    stats: { attack: 88, speed: 76, range: 70, reiatsu: 94 },
  },
  {
    id: 'hakka',
    user: 'Rukia Kuchiki',
    shikai: 'Sode no Shirayuki',
    command: 'Bare your fangs, Shirayuki',
    bankai: { jp: '白霞罸', en: 'Hakka no Togame', romaji: 'Punishment of the White Mist' },
    lore: 'Absolute zero in a dress of white. Whatever the mist touches simply stops.',
    accent: '#cfe9ff',
    behavior: 'bloom',
    tone: { freq: 150, filter: 3000, dur: 1.3 },
    stats: { attack: 86, speed: 72, range: 88, reiatsu: 90 },
  },
];