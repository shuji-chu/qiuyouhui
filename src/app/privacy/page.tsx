import Link from 'next/link';

export const metadata = { title: '隐私政策' };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="text-slate-500 text-sm">← 返回</Link>
          <h1 className="ml-4 text-base font-semibold text-slate-800">隐私政策</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 text-[13px] text-slate-600 leading-7">
        <p className="text-xs text-slate-400 mb-6">
          生效日期：2026 年 9 月 20 日 · 最后更新：2026 年 9 月 20 日
        </p>

        <p className="mb-6">
          球友会（以下简称"本站"）非常重视你的隐私。本政策说明我们收集哪些信息、如何使用、如何保护，以及你享有的权利。使用本站服务即表示你已阅读并同意本政策。
        </p>

        <Section title="一、我们收集的信息">
          <SubTitle>1. 你主动提供的信息</SubTitle>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>邮箱地址（用于注册、登录、通知）</li>
            <li>密码（加密存储，我们无法看到明文）</li>
            <li>你发布的聊天内容、评论、竞猜记录</li>
          </ul>

          <SubTitle>2. 第三方授权登录返回的信息</SubTitle>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>通过 SafeW 登录时：SafeW 用户 ID、用户名、头像</li>
            <li>通过 Telegram 登录时：Telegram 用户 ID、用户名、头像</li>
          </ul>

          <SubTitle>3. 自动收集的信息</SubTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>设备信息（浏览器类型、操作系统、屏幕尺寸）</li>
            <li>访问日志（IP 地址、访问时间、访问页面）</li>
            <li>Cookie 与本地存储（用于保持登录状态）</li>
          </ul>
        </Section>

        <Section title="二、信息的使用">
          <ul className="list-disc pl-5 space-y-1">
            <li>提供、维护和改进本站服务</li>
            <li>验证你的身份，保障账号安全</li>
            <li>向你推送你关注的比赛、消息和通知</li>
            <li>统计分析，优化产品体验</li>
            <li>防止欺诈、滥用和其他违法活动</li>
            <li>遵守法律法规的要求</li>
          </ul>
        </Section>

        <Section title="三、信息共享">
          <p className="mb-3">我们不会向第三方出售、出租你的个人信息。仅在以下情形下可能共享：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>服务提供商：</b>如云服务、邮件发送服务，仅用于提供基础功能</li>
            <li><b>法律要求：</b>应司法机关、监管部门合法要求提供</li>
            <li><b>业务变更：</b>如发生合并、收购，你的信息可能作为资产被转移</li>
          </ul>
        </Section>

        <Section title="四、数据安全">
          <ul className="list-disc pl-5 space-y-1">
            <li>全程使用 HTTPS 加密传输</li>
            <li>密码使用行业标准算法加盐哈希存储</li>
            <li>敏感数据传输采用令牌机制</li>
            <li>服务器访问权限严格限制</li>
          </ul>
          <p className="mt-3">
            但请理解：互联网环境不存在绝对安全，我们无法保证信息百分之百不被泄露。
          </p>
        </Section>

        <Section title="五、Cookie 与本地存储">
          <p className="mb-3">本站使用 Cookie 和浏览器本地存储用于：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>保持你的登录状态</li>
            <li>记住你的偏好设置</li>
            <li>分析网站流量</li>
          </ul>
          <p className="mt-3">
            你可以在浏览器设置中禁用 Cookie，但可能导致登录等功能不可用。
          </p>
        </Section>

        <Section title="六、你的权利">
          <ul className="list-disc pl-5 space-y-1">
            <li><b>访问权：</b>查询我们保存的关于你的信息</li>
            <li><b>更正权：</b>修改不准确的信息</li>
            <li><b>删除权：</b>请求删除你的账号和相关信息</li>
            <li><b>撤回权：</b>随时取消第三方授权</li>
          </ul>
          <p className="mt-3">
            如需行使以上权利，请发送邮件至 support@qiuyouhui.app。
          </p>
        </Section>

        <Section title="七、未成年人保护">
          <p>
            本站不面向 14 周岁以下未成年人。如发现我们在未获得监护人同意的情况下收集了未成年人信息，将尽快删除。
          </p>
        </Section>

        <Section title="八、政策更新">
          <p>
            本政策可能不定期更新。重大变更会在网站显著位置公告。继续使用本站服务即视为接受更新后的政策。
          </p>
        </Section>

        <Section title="九、联系我们">
          <p>
            如对本政策有任何疑问、意见或投诉，请联系：
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

function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="font-medium text-slate-700 mb-1.5">{children}</p>;
}