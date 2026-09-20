export interface MockChannel {
  id: string;
  name: string;
  league: string;
  leagueIcon: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
  status: 'live' | 'upcoming' | 'replay';
  streamUrl: string;
  viewers: number;
}

export const MOCK_CHANNELS: MockChannel[] = [
  {
    id: 'c1', name: '英超 · 利物浦 vs 曼城',
    league: '英超', leagueIcon: '🏴',
    home: '利物浦', away: '曼城',
    homeScore: 2, awayScore: 1, minute: 63,
    status: 'live',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 5621,
  },
  {
    id: 'c2', name: '欧冠 · 皇马 vs 拜仁',
    league: '欧冠', leagueIcon: '🏆',
    home: '皇马', away: '拜仁',
    homeScore: 1, awayScore: 1, minute: 45,
    status: 'live',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    viewers: 9821,
  },
  {
    id: 'c3', name: '西甲 · 巴萨 vs 马竞',
    league: '西甲', leagueIcon: '🇪🇸',
    home: '巴萨', away: '马竞',
    homeScore: 0, awayScore: 0, minute: 12,
    status: 'live',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    viewers: 3421,
  },
  {
    id: 'c4', name: '意甲 · 国米 vs AC米兰',
    league: '意甲', leagueIcon: '🇮🇹',
    home: '国米', away: 'AC米兰',
    homeScore: 1, awayScore: 0, minute: 78,
    status: 'live',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 2187,
  },
  {
    id: 'c5', name: '德甲 · 拜仁 vs 多特',
    league: '德甲', leagueIcon: '🇩🇪',
    home: '拜仁', away: '多特',
    homeScore: 3, awayScore: 0, minute: 90,
    status: 'live',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    viewers: 7102,
  },
  {
    id: 'c6', name: '法甲 · 巴黎 vs 马赛',
    league: '法甲', leagueIcon: '🇫🇷',
    home: '巴黎', away: '马赛',
    homeScore: 2, awayScore: 2, minute: 55,
    status: 'live',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    viewers: 4531,
  },
  {
    id: 'c7', name: 'J联赛 · 横滨 vs 川崎',
    league: 'J联赛', leagueIcon: '🇯🇵',
    home: '横滨', away: '川崎',
    homeScore: 1, awayScore: 2, minute: 30,
    status: 'live',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 1243,
  },
  {
    id: 'c8', name: 'K联赛 · 全北 vs 蔚山',
    league: 'K联赛', leagueIcon: '🇰🇷',
    home: '全北', away: '蔚山',
    homeScore: 0, awayScore: 0, minute: 5,
    status: 'live',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    viewers: 821,
  },
  {
    id: 'c9', name: '英超 · 阿森纳 vs 热刺',
    league: '英超', leagueIcon: '🏴',
    home: '阿森纳', away: '热刺',
    homeScore: null, awayScore: null, minute: null,
    status: 'upcoming',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 0,
  },
  {
    id: 'c10', name: '欧冠 · 曼城 vs 国米',
    league: '欧冠', leagueIcon: '🏆',
    home: '曼城', away: '国米',
    homeScore: null, awayScore: null, minute: null,
    status: 'upcoming',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    viewers: 0,
  },
  {
    id: 'c11', name: '德乙 · 汉堡 vs 沙尔克',
    league: '德乙', leagueIcon: '🇩🇪',
    home: '汉堡', away: '沙尔克',
    homeScore: null, awayScore: null, minute: null,
    status: 'upcoming',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    viewers: 0,
  },
];

export interface MockReplay {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  home: string;
  away: string;
  score: string;
  videoId: string;
}

export const MOCK_REPLAYS: MockReplay[] = [
  { id: 'r1', title: '英超 曼联 1-3 切尔西', league: '英超', leagueIcon: '🏴', home: '曼联', away: '切尔西', score: '1-3', videoId: 'dQw4w9WgXcQ' },
  { id: 'r2', title: '欧冠 巴黎 0-2 皇马', league: '欧冠', leagueIcon: '🏆', home: '巴黎', away: '皇马', score: '0-2', videoId: 'dQw4w9WgXcQ' },
  { id: 'r3', title: '西甲 皇马 3-2 巴萨', league: '西甲', leagueIcon: '🇪🇸', home: '皇马', away: '巴萨', score: '3-2', videoId: 'dQw4w9WgXcQ' },
  { id: 'r4', title: '意甲 尤文 1-0 国米', league: '意甲', leagueIcon: '🇮🇹', home: '尤文', away: '国米', score: '1-0', videoId: 'dQw4w9WgXcQ' },
  { id: 'r5', title: '德甲 多特 2-2 莱比锡', league: '德甲', leagueIcon: '🇩🇪', home: '多特', away: '莱比锡', score: '2-2', videoId: 'dQw4w9WgXcQ' },
  { id: 'r6', title: '法甲 巴黎 4-0 里昂', league: '法甲', leagueIcon: '🇫🇷', home: '巴黎', away: '里昂', score: '4-0', videoId: 'dQw4w9WgXcQ' },
];

export function getMockChannel(id: string) {
  return MOCK_CHANNELS.find((c) => c.id === id);
}

export function getMockReplay(id: string) {
  return MOCK_REPLAYS.find((r) => r.id === id);
}