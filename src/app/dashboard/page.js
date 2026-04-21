'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../components/AuthProvider';

const CATEGORIES = {
  restaurant: '🍽️ 餐廳', cafe: '☕ 咖啡廳', shop: '🛍️ 商店',
  hotel: '🏨 住宿', attraction: '📍 景點', other: '✨ 其他',
};
const CITIES = { taitung: '台東', tainan: '台南', hualien: '花蓮' };

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [shop, setShop] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [phrases, setPhrases] = useState([]);
  const [vocab, setVocab] = useState([]);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from('shops').select('*').eq('owner_id', user.id).single()
      .then(({ data }) => { setShop(data); setFetching(false); });
  }, [user]);

  function startEdit() {
    setForm({ ...shop });
    setPhrases(Array.isArray(shop.phrases) ? shop.phrases : []);
    setVocab(Array.isArray(shop.key_vocabulary) ? shop.key_vocabulary : []);
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('shops').update({
      ...form,
      phrases: phrases.filter(p => p.en?.trim()),
      key_vocabulary: vocab.filter(v => v.word?.trim()),
    }).eq('id', shop.id);
    setSaving(false);
    if (error) { setSaveMsg('儲存失敗：' + error.message); return; }
    const { data } = await supabase.from('shops').select('*').eq('id', shop.id).single();
    setShop(data);
    setEditing(false);
    setSaveMsg('已儲存');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  function updatePhrase(i, k, v) { const n = [...phrases]; n[i] = { ...n[i], [k]: v }; setPhrases(n); }
  function updateVocab(i, k, v) { const n = [...vocab]; n[i] = { ...n[i], [k]: v }; setVocab(n); }

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!shop) return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🏪</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">還沒有店家</h1>
        <p className="text-gray-500 text-sm mb-6">申請入駐，讓旅客在來之前就學好英語</p>
        <Link href="/shops/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition text-sm">
          申請入駐
        </Link>
      </div>
    </main>
  );

  const statusConfig = shop.approved
    ? { color: 'bg-green-100 text-green-700', label: '已審核通過' }
    : { color: 'bg-amber-100 text-amber-700', label: '審核中' };

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">我的店家</h1>
          <div className="flex items-center gap-3">
            {saveMsg && <span className="text-xs text-green-600">{saveMsg}</span>}
            {!editing ? (
              <button onClick={startEdit}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium">
                編輯
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition">
                  取消
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? '儲存中...' : '儲存'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status banner */}
        <div className={`${statusConfig.color} rounded-xl px-4 py-3 text-sm font-medium mb-5 flex items-center gap-2`}>
          {shop.approved ? '✅' : '⏳'} {statusConfig.label}
          {!shop.approved && <span className="font-normal text-amber-600">— 審核通過後將顯示在店家列表</span>}
        </div>

        {/* Shop info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 mb-5">
          <h2 className="font-semibold text-gray-700 text-sm">基本資訊</h2>
          {!editing ? (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-bold text-gray-900">{shop.name_zh}</p>
                <p className="text-sm text-gray-400">{shop.name_en}</p>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{CATEGORIES[shop.category]}</span>
                <span>·</span>
                <span>{CITIES[shop.city]}</span>
              </div>
              {shop.description_zh && <p className="text-sm text-gray-600">{shop.description_zh}</p>}
              <div className="space-y-1 text-sm text-gray-500">
                {shop.address && <p>📍 {shop.address}</p>}
                {shop.phone && <p>📞 {shop.phone}</p>}
                {shop.instagram && <p>📷 @{shop.instagram.replace('@', '')}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name_zh || ''} onChange={e => setForm(f => ({ ...f, name_zh: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="店家名稱（中文）" />
                <input value={form.name_en || ''} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="英文名稱" />
              </div>
              <textarea value={form.description_zh || ''} onChange={e => setForm(f => ({ ...f, description_zh: e.target.value }))} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="店家介紹（中文）" />
              <textarea value={form.description_en || ''} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="英文介紹" />
              <input value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="地址" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="電話" />
                <input value={form.instagram || ''} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Instagram" />
              </div>
              <input value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="封面圖片網址" />
            </div>
          )}
        </div>

        {/* Phrases */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">練習句</h2>
          {!editing ? (
            <div className="space-y-3">
              {(shop.phrases || []).length === 0
                ? <p className="text-sm text-gray-400">尚未設定練習句</p>
                : (shop.phrases || []).map((p, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3">
                    <p className="text-sm font-medium text-gray-800">{p.en}</p>
                    <p className="text-xs text-amber-700 mt-0.5">{p.zh}</p>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="space-y-3">
              {phrases.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
                  <input value={p.en || ''} onChange={e => updatePhrase(i, 'en', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-400"
                    placeholder="英文句子" />
                  <input value={p.zh || ''} onChange={e => updatePhrase(i, 'zh', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-400"
                    placeholder="中文翻譯" />
                  <div className="flex gap-2">
                    <input value={p.tip || ''} onChange={e => updatePhrase(i, 'tip', e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-400"
                      placeholder="使用提示（選填）" />
                    <button onClick={() => setPhrases(phrases.filter((_, j) => j !== i))}
                      className="text-xs text-gray-300 hover:text-red-400 px-2">刪除</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setPhrases([...phrases, { en: '', zh: '', tip: '' }])}
                className="text-sm text-blue-500 hover:text-blue-700">+ 新增練習句</button>
            </div>
          )}
        </div>

        {/* View shop link */}
        {shop.approved && shop.published && (
          <Link href={`/shops/${shop.city}/${shop.id}`}
            className="block text-center text-sm text-blue-600 hover:underline">
            查看店家公開頁面 →
          </Link>
        )}
      </div>
    </main>
  );
}
