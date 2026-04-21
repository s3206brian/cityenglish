'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CITIES = [
  { id: 'taitung', zh: '台東', emoji: '🌊' },
  { id: 'tainan',  zh: '台南', emoji: '🏯' },
  { id: 'hualien', zh: '花蓮', emoji: '🏔️' },
];

const CATEGORIES = {
  restaurant: { label: '餐廳', emoji: '🍽️' },
  cafe:       { label: '咖啡廳', emoji: '☕' },
  shop:       { label: '商店', emoji: '🛍️' },
  hotel:      { label: '住宿', emoji: '🏨' },
  attraction: { label: '景點', emoji: '📍' },
  other:      { label: '其他', emoji: '✨' },
};

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('shops')
      .select('id, name_zh, name_en, city, category, description_zh, image_url, address')
      .eq('approved', true)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => { setShops(data || []); setLoading(false); });
  }, []);

  const filtered = shops.filter(s =>
    (cityFilter === 'all' || s.city === cityFilter) &&
    (catFilter === 'all' || s.category === catFilter)
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">英語友善店家</h1>
            <p className="text-sm text-gray-400">可以用英語溝通的在地推薦店家</p>
          </div>
          <Link
            href="/shops/register"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium shrink-0"
          >
            + 申請入駐
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setCityFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${cityFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              全部城市
            </button>
            {CITIES.map(c => (
              <button key={c.id} onClick={() => setCityFilter(c.id)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${cityFilter === c.id ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {c.emoji} {c.zh}
              </button>
            ))}
          </div>
          <div className="w-full h-px bg-gray-100 my-1" />
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setCatFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${catFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              全部類型
            </button>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <button key={k} onClick={() => setCatFilter(k)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${catFilter === k ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🏪</p>
            <p className="font-medium">尚無店家</p>
            <p className="text-sm mt-1">成為第一個入駐的店家！</p>
            <Link href="/shops/register" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              申請入駐 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(shop => {
              const cat = CATEGORIES[shop.category] || CATEGORIES.other;
              const city = CITIES.find(c => c.id === shop.city);
              return (
                <Link key={shop.id} href={`/shops/${shop.city}/${shop.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                  {shop.image_url ? (
                    <div className="h-40 overflow-hidden">
                      <img src={shop.image_url} alt={shop.name_zh}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <span className="text-5xl">{cat.emoji}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.emoji} {cat.label}</span>
                      <span className="text-xs text-gray-400">{city?.emoji} {city?.zh}</span>
                    </div>
                    <h2 className="font-bold text-gray-900">{shop.name_zh}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{shop.name_en}</p>
                    {shop.description_zh && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{shop.description_zh}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-blue-700 font-medium mb-1">你的店也可以加入！</p>
          <p className="text-xs text-blue-500 mb-3">提供英語練習句，讓旅客來前先學好怎麼點餐溝通</p>
          <Link href="/shops/register"
            className="text-sm bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition inline-block">
            免費申請入駐
          </Link>
        </div>
      </div>
    </main>
  );
}
