const fs = require('fs');
const path = require('path');

const M3U_SOURCES = [
  'https://iptv-org.github.io/iptv/categories/sports.m3u',
  'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
];

const FOOTBALL_KEYWORDS = ['football', 'soccer', '足球', '英超', '西甲', '意甲', '德甲', '法甲', '欧冠'];
const MOCK_FILE = path.join(__dirname, '..', 'src', 'data', 'mock.ts');

function parseM3U(text) {
  const lines = text.split('\n');
  const entries = [];
  let meta = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#EXTINF')) {
      const nameMatch = trimmed.match(/,(.+)$/);
      const groupMatch = trimmed.match(/group-title="([^"]*)"/);
      const logoMatch = trimmed.match(/tvg-logo="([^"]*)"/);
      meta = {
        name: nameMatch ? nameMatch[1].trim() : '',
        group: groupMatch ? groupMatch[1] : '',
        logo: logoMatch ? logoMatch[1] : '',
      };
    } else if (trimmed && !trimmed.startsWith('#') && meta) {
      if (meta.name && /^https?:\/\//.test(trimmed)) {
        entries.push({ ...meta, url: trimmed });
      }
      meta = null;
    }
  }
  return entries;
}

async function fetchAll() {
  const all = [];
  for (const url of M3U_SOURCES) {
    try {
      console.log(`Fetching: ${url}`);
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const entries = parseM3U(text);
      console.log(`  Found ${entries.length} entries`);
      all.push(...entries);
    } catch (e) {
      console.error(`  Failed: ${e.message}`);
    }
  }
  return all;
}

function filterFootball(entries) {
  return entries.filter((e) => {
    const s = `${e.name} ${e.group}`.toLowerCase();
    return FOOTBALL_KEYWORDS.some((k) => s.includes(k.toLowerCase()));
  });
}

function generateMockFile(channels) {
  const channelList = channels.slice(0, 20).map((c, i) => ({
    id: `c${i + 1}`,
    name: c.name,
    league: c.group || '足球',
    leagueIcon: '⚽',
    home: c.name.split('vs')[0]?.trim() || c.name,
    away: c.name.split('vs')[1]?.trim() || '待定',
    homeScore: null,
    awayScore: null,
    minute: null,
    status: 'live',
    streamUrl: c.url,
    viewers: Math.floor(Math.random() * 10000),
  }));

  const content = `// 此文件由 scripts/update-streams.js 自动生成
// 最后更新: ${new Date().toISOString()}
// 数据来源: iptv-org, Free-TV

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

export const MOCK_CHANNELS: MockChannel[] = ${JSON.stringify(channelList, null, 2)};

export function getMockChannel(id: string) {
  return MOCK_CHANNELS.find((c) => c.id === id);
}
`;
  fs.writeFileSync(MOCK_FILE, content, 'utf-8');
  console.log(`Written ${channelList.length} channels to mock.ts`);
}

async function main() {
  console.log('Starting stream update...');
  const all = await fetchAll();
  const football = filterFootball(all);
  console.log(`Filtered to ${football.length} football channels`);

  if (football.length === 0) {
    console.log('No football channels found, skipping update.');
    return;
  }

  // 去重
  const seen = new Set();
  const unique = football.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  generateMockFile(unique);
  console.log('Done!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});