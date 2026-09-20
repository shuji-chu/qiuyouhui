import Link from 'next/link';

export const metadata = { title: '服务条款' };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-slate-500 text-sm">← 返回</Link>
          <h1 className="ml-4 text-base font-semibold text-slate-800">服务条款</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 text-[13px] text-slate-600 leading-7">
        <p className="text-xs text-slate-400 mb-6">
          生效日期：2026 年 9 月 20 日 · 最后更新：2026 年 9 月 20 日
        </p>

        <p className="mb-6">
          欢迎使用球友会。请在使用本站服务前仔细阅读以下条款。注册或使用本站服务即表示你同意本条款全部内容。
        </p>

        <Section title="一、服务内容">
          <p className="mb-3">本站提供以下服务：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>足球赛事资讯、赛程与比分数据</li>
            <li>直播观看与回放</li>
            <li>球迷交流、评论与竞猜互动</li>
          </ul>
          <p className="mt-3">
            本站有权根据运营需要调整、暂停或终止部分或全部服务，恕不另行通知。
          </p>
        </Section>

        <Section title="二、账号注册与安全">
          <ul className="list-disc pl-5 space-y-1">
            <li>你可以通过邮箱或第三方授权（SafeW、Telegram）注册账号</li>
            <li>请勿使用他人身份或虚假信息注册</li>
            <li>妥善保管账号密码，因个人原因造成的账号泄露由你自行承担</li>
            <li>发现账号异常应立即联系我们</li>
          </ul>
        </Section>

        <Section title="三、用户行为规范">
          <p className="mb-3">在使用本站服务时，你承诺不进行以下行为：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>发布违法、暴力、色情、赌博、诈骗等信息</li>
            <li>侮辱、诽谤、骚扰他人，或散布仇恨言论</li>
            <li>侵犯他人知识产权、隐私权或其他合法权益</li>
            <li>发布广告、垃圾信息或恶意刷屏</li>
            <li>使用自动化工具批量操作、抓取数据</li>
            <li>利用技术手段攻击、破坏本站系统</li>
            <li>冒用他人身份或冒充本站官方</li>
          </ul>
        </Section>

        <Section title="四、内容版权">
          <ul className="list-disc pl-5 space-y-1">
            <li>本站展示的赛事数据、直播流、图片等，其版权归原权利人所有</li>
            <li>用户在本站发布的内容，用户保留所有权，但授予本站免费、非独家的展示与传播权</li>
            <li>如你认为本站内容侵犯了你的权利，请联系我们并提供有效证明，我们将依法处理</li>
          </ul>
        </Section>

        <Section title="五、违规处理">
          <p className="mb-3">如你违反本条款，本站有权采取以下措施：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>删除违规内容</li>
            <li>限制账号部分或全部功能</li>
            <li>暂停或永久封禁账号</li>
            <li>向司法机关举报或配合调查</li>
          </ul>
        </Section>

        <Section title="六、免责声明">
          <ul className="list-disc pl-5 space-y-1">
            <li>本站不对第三方内容的准确性、完整性负责</li>
            <li>本站不对因网络故障、系统维护、不可抗力导致的服务中断负责</li>
            <li>因用户自身原因造成的损失，本站不承担赔偿责任</li>
            <li>本站的责任上限以你实际支付的服务费用为限</li>
          </ul>
        </Section>

        <Section title="七、条款变更">
          <p>
            本站有权随时修改本条款。修改后将在页面公示，重大变更会以站内通知或邮件方式提醒。继续使用服务即视为接受新条款。
          </p>
        </Section>

        <Section title="八、法律适用">
          <p>
            本条款的订立、执行与解释均适用中华人民共和国法律。因本条款引发的争议，双方应友好协商解决；协商不成的，提交本站所在地有管辖权的人民法院解决。
          </p>
        </Section>

        <Section title="九、联系方式">
          <p>
            如对本条款有任何疑问，请联系：
            <br />
            邮箱：support@qiuyouhui.app
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  );
}