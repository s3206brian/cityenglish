'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CITIES = { taitung: '台東', tainan: '台南', hualien: '花蓮' };
const CATEGORIES = {
  restaurant: '🍽️ 餐廳', cafe: '☕ 咖啡廳', shop: '🛍️ 商店',
  hotel: '🏨 住宿', attraction: '📍 景點', other: '✨ 其他',
};

export default function AdminShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [updating, setUpdating] = useState(null);
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('shops')
      .select('id, name_zh, name_en, city, category, approved, published, owner_id, created_at, description_zh')
      .order('created_at', { ascending: false });
    setShops(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function approve(shop) {
    setUpdating(shop.id);
    await supabase.from('shops').update({ approved: true, published: true }).eq('id', shop.id);
    await load();
    setUpdating(null);
  }

  async function reject(shop) {
    if (!confirm(`確定要拒絕「${shop.name_zh}」的申請？`)) return;
    setUpdating(shop.id);
    await supabase.from('shops').update({ approved: false, published: false }).eq('id', shop.id);
    await load();
    setUpdating(null);
  }

  async function togglePublish(shop) {
    setUpdating(shop.id);
    await supabase.from('shops').update({ published: !shop.published }).eq('id', shop.id);
    await load();
    setUpdating(null);
  }

  async function deleteShop(shop) {
    if (!confirm(`確定刪除「${shop.name_zh}」？`)) return;
    setUpdating(shop.id);
    await supabase.from('shops').delete().eq('id', shop.id);
    await load();
    setUpdating(null);
  }

  const filtered = shops.filter(s =>
    filter === 'all' ? true :
    filter === 'pending' ? !s.approved :
    filter === 'approved' ? s.approved : true
  );

  const pendingCount = shops.filter(s => !s.approved).length;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">店家管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">共 {shops.length} 間店家 · {pendingCount} 筆待審核</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { id: 'pending',  label: `待審核 ${pendingCount > 0 ? `(${pendingCount})` : ''}` },
          { id: 'approved', label: '已核准' },
          { id: 'all',      label: '全部' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition ${filter === f.id ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🏪</p>
          <p>{filter === 'pending' ? '沒有待審核的申請' : '沒有店家'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900">{shop.name_zh}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shop.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {shop.approved ? '已核准' : '待審核'}
                    </span>
                    {shop.approved && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shop.published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {shop.published ? '已發布' : '已隱藏'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{shop.name_en}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{CATEGORIES[shop.category]}</span>
                    <span>·</span>
                    <span>{CITIES[shop.city]}</span>
                    <span>·</span>
                    <span>{new Date(shop.created_at).toLocaleDateString('zh-TW')}</span>
                  </div>
                  {shop.description_zh && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{shop.description_zh}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!shop.approved ? (
                    <>
                      <button onClick={() => approve(shop)} disabled={updating === shop.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium disabled:opacity-50">
                        {updating === shop.id ? '...' : '✓ 核准'}
                      </button>
                      <button onClick={() => reject(shop)} disabled={updating === shop.id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition font-medium disabled:opacity-50">
                        拒絕
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => togglePublish(shop)} disabled={updating === shop.id}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition disabled:opacity-50 ${shop.published ? 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                        {shop.published ? '隱藏' : '發布'}
                      </button>
                      <Link href={`/shops/${shop.city}/${shop.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition font-medium text-center">
                        查看
                      </Link>
                      <button onClick={() => deleteShop(shop)} disabled={updating === shop.id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition disabled:opacity-50">
                        刪除
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
