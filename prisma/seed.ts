import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 公开测试流（非体育内容，用于验证播放器）
const TEST_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
];

const seedChannels = [
  // ========== 正在直播 ==========
  { name: '英超 · 利物浦 vs 曼城', league: '英超', leagueIcon: '🏴', home: '利物浦', away: '曼城', homeScore: 2, awayScore: 1, minute: 63, status: 'live', viewers: 5621 },
  { name: '欧冠 · 皇马 vs 拜仁', league: '欧冠', leagueIcon: '🏆', home: '皇马', away: '拜仁', homeScore: 1, awayScore: 1, minute: 45, status: 'live', viewers: 9821 },
  { name: '西甲 · 巴萨 vs 马竞', league: '西甲', leagueIcon: '🇪🇸', home: '巴萨', away: '马竞', homeScore: 0, awayScore: 0, minute: 12, status: 'live', viewers: 3421 },
  { name: '意甲 · 国米 vs AC米兰', league: '意甲', leagueIcon: '🇮🇹', home: '国米', away: 'AC米兰', homeScore: 1, awayScore: 0, minute: 78, status: 'live', viewers: 2187 },
  { name: '德甲 · 拜仁 vs 多特', league: '德甲', leagueIcon: '🇩🇪', home: '拜仁', away: '多特', homeScore: 3, awayScore: 0, minute: 90, status: 'live', viewers: 7102 },
  { name: '法甲 · 巴黎 vs 马赛', league: '法甲', leagueIcon: '🇫🇷', home: '巴黎', away: '马赛', homeScore: 2, awayScore: 2, minute: 55, status: 'live', viewers: 4531 },

  // ========== 即将开始 ==========
  { name: '英超 · 阿森纳 vs 热刺', league: '英超', leagueIcon: '🏴', home: '阿森纳', away: '热刺', status: 'upcoming', viewers: 0 },
  { name: '欧冠 · 曼城 vs 国米', league: '欧冠', leagueIcon: '🏆', home: '曼城', away: '国米', status: 'upcoming', viewers: 0 },
  { name: '德乙 · 汉堡 vs 沙尔克', league: '德乙', leagueIcon: '🇩🇪', home: '汉堡', away: '沙尔克', status: 'upcoming', viewers: 0 },
  { name: 'J联赛 · 横滨 vs 川崎', league: 'J联赛', leagueIcon: '🇯🇵', home: '横滨', away: '川崎', status: 'upcoming', viewers: 0 },
  { name: 'K联赛 · 全北 vs 蔚山', league: 'K联赛', leagueIcon: '🇰🇷', home: '全北', away: '蔚山', status: 'upcoming', viewers: 0 },

  // ========== 回放 ==========
  { name: '英超 · 曼联 vs 切尔西', league: '英超', leagueIcon: '🏴', home: '曼联', away: '切尔西', homeScore: 1, awayScore: 3, status: 'replay', viewers: 12043 },
  { name: '欧冠 · 巴黎 vs 皇马', league: '欧冠', leagueIcon: '🏆', home: '巴黎', away: '皇马', homeScore: 0, awayScore: 2, status: 'replay', viewers: 23561 },
  { name: '西甲 · 皇马 vs 巴萨', league: '西甲', leagueIcon: '🇪🇸', home: '皇马', away: '巴萨', homeScore: 3, awayScore: 2, status: 'replay', viewers: 18742 },
  { name: '意甲 · 尤文 vs 国米', league: '意甲', leagueIcon: '🇮🇹', home: '尤文', away: '国米', homeScore: 1, awayScore: 0, status: 'replay', viewers: 8013 },
  { name: '德甲 · 多特 vs 莱比锡', league: '德甲', leagueIcon: '🇩🇪', home: '多特', away: '莱比锡', homeScore: 2, awayScore: 2, status: 'replay', viewers: 6521 },
];

async function main() {
  console.log('开始灌数据…');

  // 清空旧数据（幂等，每次跑结果一致）
  await prisma.channel.deleteMany();

  for (let i = 0; i < seedChannels.length; i++) {
    const ch = seedChannels[i];
    await prisma.channel.create({
      data: {
        ...ch,
        streamUrl: TEST_STREAMS[i % TEST_STREAMS.length],
      },
    });
  }

  const count = await prisma.channel.count();
  console.log(`完成，共 ${count} 条频道`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());