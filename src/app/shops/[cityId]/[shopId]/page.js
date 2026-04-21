'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function speak(text) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

const CATEGORIES = {
  restaurant: { label: '餐廳', emoji: '🍽️' },
  cafe:       { label: '咖啡廳', emoji: '☕' },
  shop:       { label: '商店', emoji: '🛍️' },
  hotel:      { label: '住宿', emoji: '🏨' },
  attraction: { label: '景點', emoji: '📍' },
  other:      { label: '其他', emoji: '✨' },
};

export default function ShopDetailPage() {
  const { cityId, shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('phrases');
  const [practicingIdx, setPracticingIdx] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('shops').select('*').eq('id', shopId).single()
      .then(({ data }) => { setShop(data); setLoading(false); });
  }, [shopId]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </main>
  );

  if (!shop) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">找不到此店家</p>
        <Link href="/shops" className="text-blue-600 underline">返回店家列表</Link>
      </div>
    </main>
  );

  const cat = CATEGORIES[shop.category] || CATEGORIES.other;
  const phrases = Array.isArray(shop.phrases) ? shop.phrases : [];
  const vocab = Array.isArray(shop.key_vocabulary) ? shop.key_vocabulary : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Cover */}
      <div className="relative">
        {shop.image_url ? (
          <div className="h-56 overflow-hidden">
            <img src={shop.image_url} alt={shop.name_zh} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-56 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <span className="text-7xl">{cat.emoji}</span>
          </div>
        )}
        <Link href="/shops"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition shadow-sm">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 relative z-10">
        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{cat.emoji} {cat.label}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{shop.name_zh}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{shop.name_en}</p>

          {shop.description_zh && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{shop.description_zh}</p>
          )}
          {shop.description_en && (
            <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">{shop.description_en}</p>
          )}

          <div className="mt-4 space-y-2">
            {shop.address && (
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <span className="shrink-0">📍</span><span>{shop.address}</span>
              </div>
            )}
            {shop.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="shrink-0">📞</span>
                <a href={`tel:${shop.phone}`} className="hover:text-blue-600 transition">{shop.phone}</a>
              </div>
            )}
            {shop.website && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="shrink-0">🌐</span>
                <a href={shop.website} target="_blank" rel="noopener" className="hover:text-blue-600 transition truncate">{shop.website.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
            {shop.instagram && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="shrink-0">📷</span>
                <a href={`https://instagram.com/${shop.instagram.replace('@', '')}`} target="_blank" rel="noopener" className="hover:text-pink-500 transition">@{shop.instagram.replace('@', '')}</a>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(phrases.length > 0 || vocab.length > 0) && (
          <>
            <div className="flex bg-white rounded-xl border border-gray-100 p-1 mb-4 shadow-sm">
              {phrases.length > 0 && (
                <button onClick={() => setActiveTab('phrases')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'phrases' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  💬 練習句
                </button>
              )}
              {vocab.length > 0 && (
                <button onClick={() => setActiveTab('vocab')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'vocab' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  📖 關鍵詞彙
                </button>
              )}
            </div>

            {/* Phrases */}
            {activeTab === 'phrases' && (
              <div className="space-y-3">
                {phrases.map((phrase, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{phrase.en}</p>
                        <p className="text-sm text-amber-700 mt-1">{phrase.zh}</p>
                        {phrase.tip && (
                          <p className="text-xs text-gray-400 mt-1.5 bg-gray-50 rounded-lg px-2 py-1">💡 {phrase.tip}</p>
                        )}
                      </div>
                      <button onClick={() => speak(phrase.en)}
                        className="shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                      </button>
                    </div>
                    <button onClick={() => setPracticingIdx(practicingIdx === i ? null : i)}
                      className={`w-full text-xs py-2 rounded-xl border transition font-medium ${practicingIdx === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500'}`}>
                      {practicingIdx === i ? '✓ 練習中' : '開口練習'}
                    </button>
                    {practicingIdx === i && (
                      <div className="mt-2 bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium mb-2">跟著念：</p>
                        <p className="text-base font-semibold text-blue-800">{phrase.en}</p>
                        <button onClick={() => speak(phrase.en)} className="mt-2 text-xs text-blue-500 hover:text-blue-700">
                          🔊 再聽一遍
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Vocabulary */}
            {activeTab === 'vocab' && (
              <div className="grid grid-cols-2 gap-3">
                {vocab.map((v, i) => (
                  <button key={i} onClick={() => speak(v.word)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:border-blue-200 transition">
                    <p className="font-bold text-gray-900">{v.word}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.phonetic}</p>
                    <p className="text-sm text-amber-700 mt-1">{v.zh}</p>
                    {v.example && (
                      <p className="text-xs text-gray-400 mt-1.5 italic">"{v.example}"</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
