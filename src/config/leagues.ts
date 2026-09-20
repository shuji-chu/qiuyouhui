export interface League {
  slug: string;
  name: string;
  icon: string;
  group: string;
}

export const LEAGUES: League[] = [
  { slug: 'epl',      name: '英超',    icon: '🏴', group: '欧洲五大联赛' },
  { slug: 'laliga',   name: '西甲',    icon: '🇪🇸', group: '欧洲五大联赛' },
  { slug: 'seriea',   name: '意甲',    icon: '🇮🇹', group: '欧洲五大联赛' },
  { slug: 'bundes',   name: '德甲',    icon: '🇩🇪', group: '欧洲五大联赛' },
  { slug: 'ligue1',   name: '法甲',    icon: '🇫🇷', group: '欧洲五大联赛' },
  { slug: 'ucl',      name: '欧冠',    icon: '🏆', group: '杯赛' },
  { slug: 'uel',      name: '欧联',    icon: '🏆', group: '杯赛' },
  { slug: 'bundes2',  name: '德乙',    icon: '🇩🇪', group: '次级联赛' },
  { slug: 'jleague',  name: 'J联赛',   icon: '🇯🇵', group: '亚洲' },
  { slug: 'kleague',  name: 'K联赛',   icon: '🇰🇷', group: '亚洲' },
];

export function groupLeagues() {
  const map = new Map<string, League[]>();
  for (const l of LEAGUES) {
    if (!map.has(l.group)) map.set(l.group, []);
    map.get(l.group)!.push(l);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export function getLeague(slug: string) {
  return LEAGUES.find((l) => l.slug === slug);
}