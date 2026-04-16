'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const GRADIENTS = [
  { value: 'from-blue-500 to-cyan-500', label: '藍色' },
  { value: 'from-emerald-500 to-green-600', label: '綠色' },
  { value: 'from-amber-500 to-orange-500', label: '橘色' },
  { value: 'from-purple-500 to-pink-500', label: '紫粉' },
  { value: 'from-rose-500 to-red-500', label: '紅色' },
  { value: 'from-indigo-500 to-violet-500', label: '靛藍' },
  { value: 'from-teal-500 to-cyan-600', label: '青色' },
  { value: 'from-yellow-400 to-orange-400', label: '黃橘' },
];

function toId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'course_' + Date.now();
}

export default function CourseForm({ initial, isEdit = false }) {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [id, setId] = useState(initial?.id || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [titleEn, setTitleEn] = useState(initial?.title_en || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '📚');
  const [gradient, setGradient] = useState(initial?.gradient || GRADIENTS[0].value);
  const [description, setDescription] = useState(initial?.description || '');
  const [youtubeId, setYoutubeId] = useState(initial?.youtube_id || '');
  const [duration, setDuration] = useState(initial?.duration || '10 分鐘');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [script, setScript] = useState(initial?.script || '');

  const [objectives, setObjectives] = useState(
    Array.isArray(initial?.objectives) ? initial.objectives : ['']
  );
  const [phrases, setPhrases] = useState(
    Array.isArray(initial?.phrases) && initial.phrases.length > 0
      ? initial.phrases
      : [{ en: '', zh: '', tip: '' }]
  );
  const [keyPatterns, setKeyPatterns] = useState(
    Array.isArray(initial?.key_patterns) && initial.key_patterns.length > 0
      ? initial.key_patterns
      : [{ pattern: '', example: '', zh: '' }]
  );

  function handleTitleChange(v) {
    setTitle(v);
    if (!isEdit) setId(toId(v));
  }

  // Objectives helpers
  function updateObjective(i, v) {
    const next = [...objectives]; next[i] = v; setObjectives(next);
  }
  function addObjective() { setObjectives([...objectives, '']); }
  function removeObjective(i) { setObjectives(objectives.filter((_, j) => j !== i)); }

  // Phrases helpers
  function updatePhrase(i, field, v) {
    const next = [...phrases]; next[i] = { ...next[i], [field]: v }; setPhrases(next);
  }
  function addPhrase() { setPhrases([...phrases, { en: '', zh: '', tip: '' }]); }
  function removePhrase(i) { setPhrases(phrases.filter((_, j) => j !== i)); }

  // KeyPatterns helpers
  function updatePattern(i, field, v) {
    const next = [...keyPatterns]; next[i] = { ...next[i], [field]: v }; setKeyPatterns(next);
  }
  function addPattern() { setKeyPatterns([...keyPatterns, { pattern: '', example: '', zh: '' }]); }
  function removePattern(i) { setKeyPatterns(keyPatterns.filter((_, j) => j !== i)); }

  async function handleSave(pub) {
    setError('');
    if (!id.trim()) { setError('請填寫課程 ID'); return; }
    if (!title.trim()) { setError('請填寫課程標題'); return; }

    setSaving(true);
    const payload = {
      id: id.trim(),
      title: title.trim(),
      title_en: titleEn.trim(),
      emoji: emoji.trim() || '📚',
      gradient,
      description: description.trim(),
      youtube_id: youtubeId.trim(),
      duration: duration.trim(),
      published: pub ?? published,
      sort_order: Number(sortOrder) || 0,
      objectives: objectives.filter(Boolean),
      script: script.trim(),
      phrases: phrases.filter(p => p.en.trim()),
      key_patterns: keyPatterns.filter(k => k.pattern.trim()),
    };

    let err;
    if (isEdit) {
      ({ error: err } = await supabase.from('courses').update(payload).eq('id', initial.id));
    } else {
      ({ error: err } = await supabase.from('courses').insert(payload));
    }

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push('/admin/courses');
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">{isEdit ? '編輯課程' : '新增課程'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Preview banner */}
        <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-5 flex items-center gap-4`}>
          <span className="text-4xl">{emoji || '📚'}</span>
          <div>
            <p className="text-white font-bold">{title || '課程標題'}</p>
            <p className="text-white/70 text-sm">{titleEn || 'Course Title'}</p>
          </div>
        </div>

        {/* 基本資訊 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">基本資訊</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">課程標題 *</label>
              <input value={title} onChange={e => handleTitleChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="旅遊英語：問候與自我介紹" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">英文標題</label>
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Travel English: Greetings" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">課程 ID *</label>
            <input value={id} onChange={e => setId(e.target.value)} disabled={isEdit}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="beginner_greetings" />
            {!isEdit && <p className="text-xs text-gray-400 mt-1">由標題自動生成，可手動修改（只限英文、數字、底線）</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">課程簡介</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              placeholder="學習最基本的問候語，讓你在旅遊時能輕鬆開口..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Emoji 圖示</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="👋" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">課程時長</label>
              <input value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="10 分鐘" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">排序</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">顏色主題</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map(g => (
                <button key={g.value} onClick={() => setGradient(g.value)}
                  className={`rounded-lg h-8 w-16 bg-gradient-to-r ${g.value} transition ring-2 ${
                    gradient === g.value ? 'ring-blue-500 ring-offset-2' : 'ring-transparent'
                  }`} title={g.label} />
              ))}
            </div>
          </div>
        </section>

        {/* YouTube */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">影片</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">YouTube 影片 ID</label>
            <input value={youtubeId} onChange={e => setYoutubeId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-400"
              placeholder="dQw4w9WgXcQ（YouTube 網址 ?v= 後面的部分）" />
          </div>
          {youtubeId && (
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-100">
              <iframe width="100%" height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                frameBorder="0" allowFullScreen />
            </div>
          )}
        </section>

        {/* 學習目標 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm">學習目標</h2>
          {objectives.map((obj, i) => (
            <div key={i} className="flex gap-2">
              <input value={obj} onChange={e => updateObjective(i, e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder={`目標 ${i + 1}`} />
              <button onClick={() => removeObjective(i)}
                className="text-gray-300 hover:text-red-400 transition px-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button onClick={addObjective}
            className="text-sm text-blue-500 hover:text-blue-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增目標
          </button>
        </section>

        {/* 影片腳本 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm">影片腳本</h2>
          <textarea value={script} onChange={e => setScript(e.target.value)} rows={8}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-y font-mono"
            placeholder={"Hello! My name is Sarah.\nNice to meet you!\nWhere are you from?"} />
          <p className="text-xs text-gray-400">每行一句，學生可以逐行播放音訊練習</p>
        </section>

        {/* 練習句 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">練習句</h2>
          {phrases.map((phrase, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">練習句 {i + 1}</span>
                <button onClick={() => removePhrase(i)}
                  className="text-gray-300 hover:text-red-400 transition text-xs">刪除</button>
              </div>
              <input value={phrase.en} onChange={e => updatePhrase(i, 'en', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                placeholder="英文句子（必填）" />
              <input value={phrase.zh} onChange={e => updatePhrase(i, 'zh', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                placeholder="中文翻譯" />
              <input value={phrase.tip} onChange={e => updatePhrase(i, 'tip', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                placeholder="使用提示（選填）" />
            </div>
          ))}
          <button onClick={addPhrase}
            className="text-sm text-blue-500 hover:text-blue-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增練習句
          </button>
        </section>

        {/* 句型 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm">句型</h2>
          {keyPatterns.map((kp, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-amber-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">句型 {i + 1}</span>
                <button onClick={() => removePattern(i)}
                  className="text-gray-300 hover:text-red-400 transition text-xs">刪除</button>
              </div>
              <input value={kp.pattern} onChange={e => updatePattern(i, 'pattern', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white font-mono"
                placeholder="I'm from + place（句型結構，必填）" />
              <input value={kp.zh} onChange={e => updatePattern(i, 'zh', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white"
                placeholder="我來自...（句型中文說明）" />
              <input value={kp.example} onChange={e => updatePattern(i, 'example', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white"
                placeholder="I'm from Taipei.（例句）" />
            </div>
          ))}
          <button onClick={addPattern}
            className="text-sm text-blue-500 hover:text-blue-700 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增句型
          </button>
        </section>

        {/* Save buttons */}
        <div className="flex items-center gap-3 pt-2 pb-10">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            {saving ? '儲存中...' : '儲存為草稿'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? '儲存中...' : '儲存並發布'}
          </button>
        </div>
      </div>
    </div>
  );
}
