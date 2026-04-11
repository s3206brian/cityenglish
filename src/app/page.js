import Link from 'next/link';

const CITIES = [
  {
    id: 'taitung',
    name: '台東',
    nameEn: 'Taitung',
    tagline: 'Where mountains meet the sea',
    description: '太平洋海岸線、熱帶森林與原住民文化的完美交融，是練習英文「自然與文化」詞彙的絕佳場景。',
    emoji: '🏔️',
    gradient: 'from-emerald-400 to-teal-600',
    spots: ['Tiehua Music Village', 'Taitung Forest Park', 'Green Island', 'Sanxiantai', 'Zhiben Hot Springs'],
  },
  {
    id: 'tainan',
    name: '台南',
    nameEn: 'Tainan',
    tagline: 'The ancient capital of Taiwan',
    description: '400年歷史古都，廟宇、老街、小吃文化豐富，適合學習歷史與美食相關英文詞彙。',
    emoji: '🏯',
    gradient: 'from-amber-400 to-orange-500',
    spots: ['Anping Fort', 'Chihkan Tower', 'Hayashi Department Store', 'Tainan Confucius Temple'],
  },
  {
    id: 'hualien',
    name: '花蓮',
    nameEn: 'Hualien',
    tagline: 'Gateway to Taroko Gorge',
    description: '太魯閣峽谷、七星潭與花蓮港，適合學習地質與海洋相關英文詞彙。',
    emoji: '🏞️',
    gradient: 'from-sky-400 to-blue-600',
    spots: ['Taroko Gorge', 'Qixingtan Beach', 'Liyu Lake', 'Hualien Cultural Creative Park'],
  },
];

const FEATURES = [
  {
    icon: '🎙️',
    iconBg: 'from-pink-500 to-rose-500',
    title: '即時口說評分',
    description: '使用 Google STT 技術，分析每個單字的發音準確度，給予即時反饋。',
  },
  {
    icon: '🗺️',
    iconBg: 'from-blue-500 to-indigo-500',
    title: '景點情境學習',
    description: '以真實台灣景點為情境，學習在旅行中實際會用到的英文句子。',
  },
  {
    icon: '📈',
    iconBg: 'from-green-500 to-emerald-500',
    title: '個人進度追蹤',
    description: '記錄每個單字的練習歷程與最佳成績，找出需要加強的發音弱點。',
  },
  {
    icon: '📱',
    iconBg: 'from-purple-500 to-violet-500',
    title: '行動優先設計',
    description: '搭配 CityEnglish App，隨時隨地在景點現場練習英文，學習更有感。',
  },
];

const STEPS = [
  { step: '01', title: '選擇城市', description: '從台東、台南、花蓮等台灣特色城市中選擇你感興趣的目的地。' },
  { step: '02', title: '學習景點英文', description: '瀏覽景點名稱、常用例句與關鍵詞彙，建立情境語感。' },
  { step: '03', title: '開口練習發音', description: '錄下你的口說，AI 即時分析發音並給出逐字評分。' },
  { step: '04', title: '追蹤進步成果', description: '查看練習歷程，持續突破個人最佳成績。' },
];

const STATS = [
  { value: '3', label: '座精選城市' },
  { value: '50+', label: '個景點詞彙' },
  { value: '500+', label: '句練習例句' },
  { value: 'AI', label: '即時發音評分' },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-28 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            🌏 台灣城市英語學習平台
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight tracking-tight">
            用旅行<span className="text-yellow-300">學英文</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            CityEnglish 結合台灣城市景點與 AI 口說評分，
            在真實情境中練習英文，發音進步看得見。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#cities"
              className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 transition shadow-lg shadow-blue-900/20"
            >
              探索城市 →
            </a>
            <a
              href="/leaderboard/taitung"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 hover:border-white transition flex items-center gap-2"
            >
              🏆 城市排行榜
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative max-w-3xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-blue-200 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">如何使用？</h2>
          <p className="text-center text-gray-500 mb-14">四個步驟，讓旅行變成你的英語教室</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-md shadow-blue-200">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
            為什麼選擇 CityEnglish？
          </h2>
          <p className="text-center text-gray-500 mb-14">專為台灣旅人設計的英語學習體驗</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2 text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">探索台灣城市</h2>
          <p className="text-center text-gray-500 mb-14">
            每個城市都有獨特的英文詞彙與口說情境，從你最想去的地方開始學習。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CITIES.map((city) => (
              <article
                key={city.id}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group bg-white"
              >
                <div className={`bg-gradient-to-br ${city.gradient} h-44 flex items-center justify-center text-7xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition" />
                  <span className="drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">
                    {city.emoji}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
                    <span className="text-gray-400 text-sm">{city.nameEn}</span>
                  </div>
                  <p className="text-blue-600 text-sm italic mb-3">&ldquo;{city.tagline}&rdquo;</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{city.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {city.spots.map((spot) => (
                      <span
                        key={spot}
                        className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                      >
                        {spot}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/cities/${city.id}`}
                    className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition"
                  >
                    開始練習 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="text-5xl mb-6">📲</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">立即開始練習</h2>
          <p className="text-blue-100 mb-10 text-lg leading-relaxed">
            下載 CityEnglish App，在任何景點隨時開啟發音練習，
            AI 即時給分，讓英文口說快速進步。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-3 bg-black text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-800 transition">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </button>
            <button className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition">
              <span className="text-2xl">▶️</span>
              <div className="text-left">
                <div className="text-xs text-gray-500">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p className="font-semibold text-gray-600 text-base">
            City<span className="text-blue-600">English</span>
          </p>
          <p>© 2026 CityEnglish. 用旅行學英文，讓每個景點都是你的英語教室。</p>
        </div>
      </footer>
    </main>
  );
}
