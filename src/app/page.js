const CITIES = [
  {
    id: 'taitung',
    name: '台東',
    nameEn: 'Taitung',
    tagline: 'Where mountains meet the sea',
    description: '太平洋海岸線、熱帶森林與原住民文化的完美交融，是練習英文「自然與文化」詞彙的絕佳場景。',
    image: '🏔️',
    spots: ['Tiehua Music Village', 'Taitung Forest Park', 'Green Island', 'Sanxiantai', 'Zhiben Hot Springs'],
  },
  {
    id: 'tainan',
    name: '台南',
    nameEn: 'Tainan',
    tagline: 'The ancient capital of Taiwan',
    description: '400年歷史古都，廟宇、老街、小吃文化豐富，適合學習歷史與美食相關英文詞彙。',
    image: '🏯',
    spots: ['Anping Fort', 'Chihkan Tower', 'Hayashi Department Store', 'Tainan Confucius Temple'],
  },
  {
    id: 'hualien',
    name: '花蓮',
    nameEn: 'Hualien',
    tagline: 'Gateway to Taroko Gorge',
    description: '太魯閣峽谷、七星潭與花蓮港，適合學習地質與海洋相關英文詞彙。',
    image: '🏞️',
    spots: ['Taroko Gorge', 'Qixingtan Beach', 'Liyu Lake', 'Hualien Cultural Creative Park'],
  },
];

const FEATURES = [
  {
    icon: '🎙️',
    title: '即時口說評分',
    description: '使用 Google STT 技術，分析每個單字的發音準確度，給予即時反饋。',
  },
  {
    icon: '🗺️',
    title: '景點情境學習',
    description: '以真實台灣景點為情境，學習在旅行中實際會用到的英文句子。',
  },
  {
    icon: '📈',
    title: '個人進度追蹤',
    description: '記錄每個單字的練習歷程與最佳成績，找出需要加強的發音弱點。',
  },
  {
    icon: '📱',
    title: '行動優先設計',
    description: '搭配 CityEnglish App，隨時隨地在景點現場練習英文，學習更有感。',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            用旅行學英文
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            CityEnglish 結合台灣城市景點與 AI 口說評分，
          </p>
          <p className="text-xl text-blue-100 mb-10">
            讓你在真實情境中練習英文，發音進步看得見。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#cities"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
            >
              探索城市
            </a>
            <a
              href="#download"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              下載 App
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            為什麼選擇 CityEnglish？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">探索台灣城市</h2>
          <p className="text-center text-gray-500 mb-12">
            每個城市都有獨特的英文詞彙與口說情境，從你最想去的地方開始學習。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CITIES.map((city) => (
              <article
                key={city.id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 h-40 flex items-center justify-center text-6xl">
                  {city.image}
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
                    <span className="text-gray-400 text-sm">{city.nameEn}</span>
                  </div>
                  <p className="text-blue-600 text-sm italic mb-3">&ldquo;{city.tagline}&rdquo;</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{city.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {city.spots.map((spot) => (
                      <span
                        key={spot}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {spot}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-20 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">立即開始練習</h2>
          <p className="text-blue-100 mb-8">
            下載 CityEnglish App，在任何景點隨時開啟發音練習，AI 即時給分，讓英文口說快速進步。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition">
              App Store 下載
            </button>
            <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
              Google Play 下載
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-gray-400 text-sm border-t">
        <p>© 2026 CityEnglish. 用旅行學英文，讓每個景點都是你的英語教室。</p>
      </footer>
    </main>
  );
}
