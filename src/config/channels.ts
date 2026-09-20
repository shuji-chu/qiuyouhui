export interface StreamChannel {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  home?: string;
  away?: string;
  score?: string;
  status: 'live' | 'upcoming' | 'replay';
  url: string;        // m3u8 地址
  poster?: string;    // 封面
  viewers: number;
  category: 'football' | 'basketball' | 'other';
}

// 公开 IPTV 源，随时可能失效
// 更新源：https://github.com/iptv-org/iptv
export const CHANNELS: StreamChannel[] = [
  {
    id: 'cctv5',
    title: 'CCTV5 体育',
    league: '综合',
    leagueIcon: '📺',
    status: 'live',
    url: 'https://cdn.jsdelivr.net/gh/iptv-org/iptv@master/streams/cn.m3u',
    viewers: 12453,
    category: 'football',
  },
  {
    id: 'cctv5plus',
    title: 'CCTV5+ 赛事',
    league: '综合',
    leagueIcon: '📺',
    status: 'live',
    url: '',
    viewers: 8213,
    category: 'football',
  },
  {
    id: 'epl-1',
    title: '英超直播 1',
    league: '英超',
    leagueIcon: '🏴',
    home: '利物浦',
    away: '曼城',
    score: '2 - 1',
    status: 'live',
    url: '',
    viewers: 5621,
    category: 'football',
  },
  {
    id: 'ucl-1',
    title: '欧冠直播',
    league: '欧冠',
    leagueIcon: '🏆',
    home: '皇马',
    away: '拜仁',
    score: '1 - 1',
    status: 'live',
    url: '',
    viewers: 9821,
    category: 'football',
  },
  {
    id: 'laliga-1',
    title: '西甲直播',
    league: '西甲',
    leagueIcon: '🇪🇸',
    home: '巴萨',
    away: '马竞',
    status: 'upcoming',
    url: '',
    viewers: 3421,
    category: 'football',
  },
  {
    id: 'seriea-1',
    title: '意甲直播',
    league: '意甲',
    leagueIcon: '🇮🇹',
    home: '国米',
    away: 'AC米兰',
    status: 'upcoming',
    url: '',
    viewers: 2187,
    category: 'football',
  },
  {
    id: 'bundes-1',
    title: '德甲直播',
    league: '德甲',
    leagueIcon: '🇩🇪',
    home: '拜仁',
    away: '多特',
    status: 'replay',
    score: '3 - 0',
    url: '',
    viewers: 5102,
    category: 'football',
  },
  {
    id: 'nba-1',
    title: 'NBA 直播',
    league: 'NBA',
    leagueIcon: '🏀',
    home: '湖人',
    away: '勇士',
    status: 'live',
    url: '',
    viewers: 15230,
    category: 'basketball',
  },
];

export function getChannel(id: string) {
  return CHANNELS.find((c) => c.id === id);
}
