'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../../components/AuthProvider';

const CITIES = [
  { id: 'taitung', zh: '台東' },
  { id: 'tainan',  zh: '台南' },
  { id: 'hualien', zh: '花蓮' },
];

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ 餐廳' },
  { id: 'cafe',       label: '☕ 咖啡廳' },
  { id: 'shop',       label: '🛍️ 商店' },
  { id: 'hotel',      label: '🏨 住宿' },
  { id: 'attraction', label: '📍 景點' },
  { id: 'other',      label: '✨ 其他' },
];

export default function ShopRegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name_zh: '', name_en: '', city: '', category: 'restaurant',
    description_zh: '', description_en: '',
    address: '', phone: '', website: '', instagram: '', image_url: '',
  });
  const [phrases, setPhrases] = useState([{ en: '', zh: '', tip: '' }]);
  const [vocab, setVocab] = useState([{ word: '', phonetic: '', zh: '', example: '' }]);

  function updateForm(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function updatePhrase(i, k, v) { const n = [...phrases]; n[i] = { ...n[i], [k]: v }; setPhrases(n); }
  function addPhrase() { setPhrases([...phrases, { en: '', zh: '', tip: '' }]); }
  function removePhrase(i) { setPhrases(phrases.filter((_, j) => j !== i)); }
  function updateVocab(i, k, v) { const n = [...vocab]; n[i] = { ...n[i], [k]: v }; setVocab(n); }
  function addVocab() { setVocab([...vocab, { word: '', phonetic: '', zh: '', example: '' }]); }
  function removeVocab(i) { setVocab(vocab.filter((_, j) => j !== i)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!user) { setError('請先登入再申請入駐'); return; }
    if (!form.name_zh.trim()) { setError('請填寫店家名稱'); return; }
    if (!form.city) { setError('請選擇城市'); return; }

    setSaving(true);
    const { error: err } = await supabase.from('shops').insert({
      ...form,
      owner_id: user.id,
      phrases: phrases.filter(p => p.en.trim()),
      key_vocabulary: vocab.filter(v => v.word.trim()),
      approved: false,
      published: false,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSubmitted(true);
  }

  if (submitted) return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">申請已送出！</h1>
        <p className="text-gray-500 text-sm mb-6">我們會在 1-3 個工作天內審核您的申請，審核通過後店家將顯示在列表中。</p>
        <Link href="/shops" className="text-blue-600 hover:underline text-sm">← 返回店家列表</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/shops" className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">店家入駐申請</h1>
        </div>

        {!user && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-700">
            請先 <Link href="/login" className="underline font-medium">登入</Link> 再申請入駐
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 基本資訊 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">基本資訊</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">店家名稱（中文）*</label>
                <input value={form.name_zh} onChange={e => updateForm('name_zh', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="鐵花咖啡" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">英文名稱</label>
                <input value={form.name_en} onChange={e => updateForm('name_en', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Tiehua Coffee" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">城市 *</label>
                <select value={form.city} onChange={e => updateForm('city', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">請選擇</option>
                  {CITIES.map(c => <option key={c.id} value={c.id}>{c.zh}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">類型</label>
                <select value={form.category} onChange={e => updateForm('category', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">店家介紹（中文）</label>
              <textarea value={form.description_zh} onChange={e => updateForm('description_zh', e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="台東在地咖啡廳，提供手沖咖啡與輕食..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">英文介紹</label>
              <textarea value={form.description_en} onChange={e => updateForm('description_en', e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="A local Taitung café serving pour-over coffee and light meals..." />
            </div>
          </section>

          {/* 聯絡資訊 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">聯絡資訊</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">地址</label>
              <input value={form.address} onChange={e => updateForm('address', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="台東縣台東市中華路一段..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">電話</label>
                <input value={form.phone} onChange={e => updateForm('phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="089-123456" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                <input value={form.instagram} onChange={e => updateForm('instagram', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="@tiehua_cafe" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">官方網站</label>
              <input value={form.website} onChange={e => updateForm('website', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">封面圖片網址</label>
              <input value={form.image_url} onChange={e => updateForm('image_url', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="https://..." />
              {form.image_url && (
                <img src={form.image_url} alt="" className="mt-2 h-32 w-full object-cover rounded-xl border border-gray-100" />
              )}
            </div>
          </section>

          {/* 練習句 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-700 text-sm">英語練習句</h2>
              <p className="text-xs text-gray-400 mt-0.5">旅客在您店裡可能會用到的英語句子</p>
            </div>
            {phrases.map((p, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">練習句 {i + 1}</span>
                  <button type="button" onClick={() => removePhrase(i)} className="text-xs text-gray-300 hover:text-red-400">刪除</button>
                </div>
                <input value={p.en} onChange={e => updatePhrase(i, 'en', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="I'd like a pour-over coffee, please." />
                <input value={p.zh} onChange={e => updatePhrase(i, 'zh', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="我想要一杯手沖咖啡，謝謝。" />
                <input value={p.tip} onChange={e => updatePhrase(i, 'tip', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="使用提示（選填）" />
              </div>
            ))}
            <button type="button" onClick={addPhrase}
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">
              + 新增練習句
            </button>
          </section>

          {/* 關鍵詞彙 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-700 text-sm">關鍵詞彙</h2>
              <p className="text-xs text-gray-400 mt-0.5">店內菜單或服務的重要英語單字</p>
            </div>
            {vocab.map((v, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 grid grid-cols-2 gap-3 bg-gray-50">
                <div className="flex justify-between items-center col-span-2">
                  <span className="text-xs text-gray-400">詞彙 {i + 1}</span>
                  <button type="button" onClick={() => removeVocab(i)} className="text-xs text-gray-300 hover:text-red-400">刪除</button>
                </div>
                <input value={v.word} onChange={e => updateVocab(i, 'word', e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="pour-over" />
                <input value={v.zh} onChange={e => updateVocab(i, 'zh', e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="手沖咖啡" />
                <input value={v.phonetic} onChange={e => updateVocab(i, 'phonetic', e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="/pɔːr ˈoʊvər/" />
                <input value={v.example} onChange={e => updateVocab(i, 'example', e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
                  placeholder="例句（選填）" />
              </div>
            ))}
            <button type="button" onClick={addVocab}
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">
              + 新增詞彙
            </button>
          </section>

          <button type="submit" disabled={saving || !user}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 text-sm">
            {saving ? '送出中...' : '送出申請'}
          </button>
        </form>
      </div>
    </main>
  );
}
