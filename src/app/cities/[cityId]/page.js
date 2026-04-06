import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from '../../data/cities';

export function generateStaticParams() {
  return Object.keys(CITIES).map((cityId) => ({ cityId }));
}

export function generateMetadata({ params }) {
  const city = CITIES[params.cityId];
  if (!city) return {};
  return { title: `${city.name} — CityEnglish` };
}

export default function CityPage({ params }) {
  const city = CITIES[params.cityId];
  if (!city) notFound();

  return (
    <main className="min-h-screen">
      {/* Banner */}
      <section className={`bg-gradient-to-br ${city.gradient} text-white py-16 px-6`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-6xl mb-4">{city.emoji}</div>
          <h1 className="text-4xl font-bold mb-1">{city.name}</h1>
          <p className="text-white/70 text-sm mb-2">{city.nameEn}</p>
          <p className="text-white/90 italic mb-2">&ldquo;{city.tagline}&rdquo;</p>
          <p className="text-white/80 text-sm">{city.description}</p>
        </div>
      </section>

      {/* City selector */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-3">
          {Object.values(CITIES).map((c) => (
            <Link
              key={c.id}
              href={`/cities/${c.id}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                c.id === city.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {city.locations.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🚧</div>
              <p className="text-lg font-medium">景點內容準備中</p>
              <p className="text-sm mt-2">敬請期待！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {city.locations.map((loc) => (
                <article
                  key={loc.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className={`bg-gradient-to-br ${city.gradient} h-32 flex items-center justify-center text-5xl`}>
                    {loc.emoji}
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h2 className="text-lg font-bold text-gray-900">{loc.nameZh}</h2>
                      <span className="text-gray-400 text-sm">{loc.nameEn}</span>
                    </div>
                    <p className="text-xs text-blue-500 font-mono mb-3">{loc.phonetic}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{loc.description}</p>

                    {/* Vocabulary tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {loc.keyVocabulary.map((v) => (
                        <span
                          key={v.word}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[v.difficulty]}`}
                        >
                          {v.word}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/practice/${loc.id}`}
                      className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      開始練習發音 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legend */}
      <div className="max-w-5xl mx-auto px-6 pb-12 flex gap-4">
        {Object.entries(DIFFICULTY_LABEL).map(([key, label]) => (
          <span key={key} className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[key]}`}>
            {label}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center">難度標示</span>
      </div>
    </main>
  );
}
