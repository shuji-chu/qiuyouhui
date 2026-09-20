export interface StreamChannel {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  status: 'live' | 'upcoming' | 'replay';
  url: string;
  viewers: number;
  category: 'football' | 'basketball' | 'other';
}

export const CHANNELS: StreamChannel[] = [
  // ↓ 公开测试流，稳定可播，用来验证播放器
  {
    id: 'test-mux',
    title: '测试流 A',
    league: '演示',
    leagueIcon: '🎬',
    status: 'live',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 1234,
    category: 'other',
  },
  {
    id: 'test-sintel',
    title: '测试流 B',
    league: '演示',
    leagueIcon: '🎬',
    status: 'live',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    viewers: 5678,
    category: 'other',
  },
  {
    id: 'test-tears',
    title: '测试流 C',
    league: '演示',
    leagueIcon: '🎬',
    status: 'live',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    viewers: 9012,
    category: 'other',
  },
];

export function getChannel(id: string) {
  return CHANNELS.find((c) => c.id === id);
}