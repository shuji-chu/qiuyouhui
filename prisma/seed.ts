import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// 公开测试流（非体育内容，用于验证播放器）
// 真实足球源需要你自己从 iptv-org 找
// ============================================
const TEST_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
];

// ============================================
// 正在直播的频道
// ============================================
const LIVE_CHANNELS = [
  { name: '英超 · 利物浦 vs 曼城', league: '英超', leagueIcon: '🏴', home: '利物浦', away: '曼城', homeScore: 2, awayScore: 1, minute: 63, viewers: 5621 },
  { name: '欧冠 · 皇马 vs 拜仁', league: '欧冠', leagueIcon: '🏆', home: '皇马', away: '拜仁', homeScore: 1, awayScore: 1, minute: 45, viewers: 9821 },
  { name: '西甲 · 巴萨 vs 马竞', league: '西甲', leagueIcon: '🇪🇸', home: '巴萨', away: '马竞', homeScore: 0, awayScore: 0, minute: 12, viewers: 3421 },
  { name: '意甲 · 国米 vs AC米兰', league: '意甲', leagueIcon: '🇮🇹', home: '国米', away: 'AC米兰', homeScore: 1, awayScore: 0, minute: 78, viewers: 2187 },
  { name: '德甲 · 拜仁 vs 多特', league: '德甲', leagueIcon: '🇩🇪', home: '拜仁', away: '多特', homeScore: 3, awayScore: 0, minute: 90, viewers: 7102 },
  { name: '法甲 · 巴黎 vs 马赛', league: '法甲', leagueIcon: '🇫🇷', home: '巴黎', away: '马赛', homeScore: 2, awayScore: 2, minute: 55, viewers: 4531 },
  { name: 'J联赛 · 横滨 vs 川崎', league: 'J联赛', leagueIcon: '🇯🇵', home: '横滨', away: '川崎', homeScore: 1, awayScore: 2, minute: 30, viewers: 1243 },
  { name: 'K联赛 · 全北 vs 蔚山', league: 'K联赛', leagueIcon: '🇰🇷', home: '全北', away: '蔚山', homeScore: 0, awayScore: 0, minute: 5, viewers: 821 },
];

// ============================================
// 即将开始的比赛
// ============================================
const UPCOMING_CHANNELS = [
  { name: '英超 · 阿森纳 vs 热刺', league: '英超', leagueIcon: '🏴', home: '阿森纳', away: '热刺' },
  { name: '欧冠 · 曼城 vs 国米', league: '欧冠', leagueIcon: '🏆', home: '曼城', away: '国米' },
  { name: '德乙 · 汉堡 vs 沙尔克', league: '德乙', leagueIcon: '🇩🇪', home: '汉堡', away: '沙尔克' },
  { name: 'J联赛 · 川崎 vs 浦和', league: 'J联赛', leagueIcon: '🇯🇵', home: '川崎', away: '浦和' },
  { name: 'K联赛 · 首尔 vs 水原', league: 'K联赛', leagueIcon: '🇰🇷', home: '首尔', away: '水原' },
];

// ============================================
// 回放视频（YouTube 演示 ID，可替换）
// ============================================
const REPLAY_VIDEOS = [
  { title: '英超 曼联 1-3 切尔西', league: '英超', leagueIcon: '🏴', home: '曼联', away: '切尔西', score: '1-3', videoId: 'dQw4w9WgXcQ' },
  { title: '欧冠 巴黎 0-2 皇马', league: '欧冠', leagueIcon: '🏆', home: '巴黎', away: '皇马', score: '0-2', videoId: 'dQw4w9WgXcQ' },
  { title: '西甲 皇马 3-2 巴萨', league: '西甲', leagueIcon: '🇪🇸', home: '皇马', away: '巴萨', score: '3-2', videoId: 'dQw4w9WgXcQ' },
  { title: '意甲 尤文 1-0 国米', league: '意甲', leagueIcon: '🇮🇹', home: '尤文', away: '国米', score: '1-0', videoId: 'dQw4w9WgXcQ' },
  { title: '德甲 多特 2-2 莱比锡', league: '德甲', leagueIcon: '🇩🇪', home: '多特', away: '莱比锡', score: '2-2', videoId: 'dQw4w9WgXcQ' },
  { title: '法甲 巴黎 4-0 里昂', league: '法甲', leagueIcon: '🇫🇷', home: '巴黎', away: '里昂', score: '4-0', videoId: 'dQw4w9WgXcQ' },
];

// ============================================
// 主流程
// ============================================
async function main() {
  console.log('开始灌数据…');

  // 清空旧数据
  await prisma.chatMessage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.replayVideo.deleteMany();

  // ---- 直播频道 ----
  for (let i = 0; i < LIVE_CHANNELS.length; i++) {
    const c = LIVE_CHANNELS[i];
    await prisma.channel.create({
      data: {
        ...c,
        status: 'live',
        streamUrl: TEST_STREAMS[i % TEST_STREAMS.length],
      },
    });
  }
  console.log(`直播频道：${LIVE_CHANNELS.length} 条`);

  // ---- 即将开始 ----
  for (let i = 0; i < UPCOMING_CHANNELS.length; i++) {
    const c = UPCOMING_CHANNELS[i];
    await prisma.channel.create({
      data: {
        ...c,
        status: 'upcoming',
        streamUrl: TEST_STREAMS[i % TEST_STREAMS.length],
        viewers: 0,
      },
    });
  }
  console.log(`即将开始：${UPCOMING_CHANNELS.length} 条`);

  // ---- 回放视频 ----
  for (const r of REPLAY_VIDEOS) {
    await prisma.replayVideo.create({ data: r });
  }
  console.log(`回放视频：${REPLAY_VIDEOS.length} 条`);

  const total = await prisma.channel.count();
  console.log(`频道总计：${total} 条`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());