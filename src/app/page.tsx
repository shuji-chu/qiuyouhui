import Link from 'next/link';
import { groupLeagues } from '@/config/leagues';

export default function HomePage() {
  const leagueGroups = groupLeagues();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-line">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="球友会"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-base font-semibold">球友会</span>
          </div>
          <Link
            href="/login"
            className="text-sm px-4 py-1.5 rounded-full bg-brand hover:bg-brand-dark text-white transition"
          >
            登录
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 联赛分类 */}
        <section className="mb-8">
          <h2 className="text-sm text-muted mb-3">联赛分类</h2>
          <div className="space-y-4">
            {leagueGroups.map(({ group, items }) => (
              <div key={group}>
                <div className="text-xs text-muted mb-2">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/category/${l.slug}`}
                      className="px-3 py-1.5 rounded-full bg-card border border-line hover:border-brand transition text-sm"
                    >
                      <span className="mr-1">{l.icon}</span>
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 比赛列表 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-muted">今日比赛</h2>
            <span className="text-xs text-muted">北京时间</span>
          </div>

          <div className="rounded-2xl bg-card border border-line p-10 text-center">
            <div className="text-3xl mb-3">⚽</div>
            <div className="text-sm text-muted">
              暂无比赛数据
            </div>
            <div className="text-xs text-muted mt-2">
              接入赛事数据后，这里会显示今日赛程
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}