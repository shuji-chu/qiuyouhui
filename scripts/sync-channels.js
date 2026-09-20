// 每天自动从 iptv-org 拉取最新足球频道，更新数据库
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// iptv-org 的体育分类
const SOURCES = [
  'https://iptv-org.github.io/iptv/categories/sports.m3u',
  'https://iptv-org.github.io/iptv/countries/cn.m3u',
  'https://iptv-org.github.io/iptv/countries/hk.m3u',
];

// 关键词过滤：只要足球相关的
const KEYWORDS = ['足球', 'football', 'soccer', 'sport', '体育', 'premier', 'laliga', 'serie'];

async function fetchM3U(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.text();
  } catch {
    return '';
  }
}

function parseM3U(text) {
  const lines = text.split('\n');
  const channels = [];
  let meta = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#EXTINF')) {
      const nameMatch = trimmed.match(/,(.+)$/);
      const logoMatch = trimmed.match(/tvg-logo="([^"]*)"/);
      const groupMatch = trimmed.match(/group-title="([^"]*)"/);
      meta = {
        name: nameMatch ? nameMatch[1].trim() : '',
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1] : '',
      };
    } else if (trimmed && !trimmed.startsWith('#') && meta) {
      if (meta.name && /^https?:\/\//.test(trimmed)) {
        channels.push({ ...meta, url: trimmed });
      }
      meta = null;
    }
  }

  return channels;
}

async function main() {
  console.log('[sync] 开始拉取源…');

  const all = [];
  for (const src of SOURCES) {
    const text = await fetchM3U(src);
    const list = parseM3U(text);
    console.log(`[sync] ${src} → ${list.length} 条`);
    all.push(...list);
  }

  // 关键词过滤
  const filtered = all.filter((c) => {
    const s = `${c.name} ${c.group}`.toLowerCase();
    return KEYWORDS.some((k) => s.includes(k.toLowerCase()));
  });

  console.log(`[sync] 过滤后 ${filtered.length} 条足球相关`);

  // 去重
  const seen = new Set();
  const unique = [];
  for (const c of filtered) {
    const key = c.url;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
  }

  // 清空旧直播（保留回放）
  await prisma.channel.deleteMany({ where: { status: 'live' } });

  // 写入数据库
  let count = 0;
  for (const c of unique.slice(0, 50)) {
    try {
      await prisma.channel.create({
        data: {
          name: c.name,
          league: c.group || '综合',
          leagueIcon: '⚽',
          status: 'live',
          streamUrl: c.url,
          coverUrl: c.logo || null,
          viewers: Math.floor(Math.random() * 10000),
        },
      });
      count++;
    } catch {}
  }

  console.log(`[sync] 完成，写入 ${count} 条`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());