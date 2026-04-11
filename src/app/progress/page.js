'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/components/AuthProvider';

function ScoreBar({ value, max = 100 }) {
  const pct = Math.round((value / max) * 100);
  const color =
    pct >= 85 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ScoreBadge({ score }) {
  const s = Number(score);
  const cls =
    s >= 85 ? 'bg-green-100 text-green-700' :
    s >= 60 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-600';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {s}
    </span>
  );
}

const CITY_META = {
  '台東': { emoji: '🏔️', gradient: 'from-emerald-500 to-teal-600', id: 'taitung' },
  '台南': { emoji: '🏯', gradient: 'from-amber-500 to-orange-600', id: 'tainan' },
  '花蓮': { emoji: '🏞️', gradient: 'from-blue-500 to-cyan-600', id: 'hualien' },
};

export default function ProgressPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const status = authLoading ? 'loading' : user ? 'authenticated' : 'unauthenticated';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { setLoading(false); return; }
    if (!user) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    supabase.auth.getSession()
      .then(({ data: { session } }) =>
        fetch(`${apiUrl}/api/user-progress/${user.id}`, {
          headers: session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {},
        })
      )
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [status, user]);

  const sessions = data?.sessions ?? [];
  const wordProgress = data?.wordProgress ?? [];
  const locationScores = data?.locationScores ?? [];

  const avgScore = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + Number(r.score), 0) / sessions.length)
    : 0;
  const masteredCount = wordProgress.filter((w) => w.mastered).length;
  const totalAttempts = sessions.length;

  // 依城市分組景點最高分
  const byCity = {};
  for (const loc of locationScores) {
    const city = loc.city || '其他';
    if (!byCity[city]) byCity[city] = [];
    byCity[city].push(loc);
  }

  // 依景點分組單字
  const wordsByLocation = {};
  for (const w of wordProgress) {
    const locId = w.location_id || 'other';
    if (!wordsByLocation[locId]) wordsByLocation[locId] = [];
    wordsByLocation[locId].push(w);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">我的進度</h1>
        <p className="text-gray-400 text-sm mb-8">追蹤你的英文口說練習歷程</p>

        {/* 未登入 */}
        {status === 'unauthenticated' && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-lg font-medium text-gray-700 mb-2">請先登入</p>
            <p className="text-sm mb-6">登入後才能查看你的練習進度</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              登入
            </button>
          </div>
        )}

        {/* 載入中 */}
        {loading && status !== 'unauthenticated' && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">📊</div>
            <p>載入中…</p>
          </div>
        )}

        {/* 錯誤 */}
        {error && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="mb-2">無法連線到伺服器</p>
          </div>
        )}

        {/* 無記錄 */}
        {!loading && !error && status === 'authenticated' && sessions.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🎙️</div>
            <p className="text-lg font-medium mb-2 text-gray-700">還沒有練習記錄</p>
            <p className="text-sm mb-6">選擇一個城市，開始你的第一次口說練習！</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              探索城市
            </Link>
          </div>
        )}

        {!loading && !error && sessions.length > 0 && (
          <>
            {/* 總覽統計 */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{totalAttempts}</div>
                <p className="text-xs text-gray-400 mt-1">練習次數</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <div className={`text-3xl font-bold ${avgScore >= 85 ? 'text-green-500' : avgScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {avgScore}
                </div>
                <p className="text-xs text-gray-400 mt-1">平均分數</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <div className="text-3xl font-bold text-emerald-500">{masteredCount}</div>
                <p className="text-xs text-gray-400 mt-1">已掌握單字</p>
              </div>
            </div>

            {/* 城市進度 */}
            {Object.keys(byCity).length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">城市進度</h2>
                <div className="space-y-4">
                  {Object.entries(byCity).map(([city, locs]) => {
                    const meta = CITY_META[city] || { emoji: '📍', gradient: 'from-gray-400 to-gray-600' };
                    const cityBest = Math.max(...locs.map((l) => Number(l.best_score)));
                    const cityAttempts = locs.reduce((s, l) => s + Number(l.attempt_count), 0);
                    return (
                      <div key={city} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {/* City header */}
                        <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-3 flex items-center justify-between`}>
                          <div className="flex items-center gap-2 text-white">
                            <span className="text-xl">{meta.emoji}</span>
                            <span className="font-bold">{city}</span>
                          </div>
                          <div className="flex items-center gap-3 text-white/80 text-xs">
                            <span>{cityAttempts} 次練習</span>
                            <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded-full text-sm">
                              最高 {cityBest}
                            </span>
                          </div>
                        </div>

                        {/* Location rows */}
                        <div className="divide-y divide-gray-50">
                          {locs.map((loc) => {
                            const best = Number(loc.best_score);
                            return (
                              <div key={loc.location_id} className="px-5 py-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <div>
                                    <span className="text-sm font-medium text-gray-800">{loc.name_zh}</span>
                                    <span className="text-xs text-gray-400 ml-2">{loc.name_en}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{loc.attempt_count} 次</span>
                                    <ScoreBadge score={best} />
                                  </div>
                                </div>
                                <ScoreBar value={best} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 單字掌握度 */}
            {wordProgress.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">單字掌握度</h2>
                <div className="space-y-4">
                  {Object.entries(wordsByLocation).map(([locId, words]) => {
                    const locInfo = locationScores.find((l) => l.location_id === locId);
                    const locName = locInfo
                      ? `${locInfo.name_zh} — ${locInfo.name_en}`
                      : locId;
                    const mastered = words.filter((w) => w.mastered).length;
                    return (
                      <div key={locId} className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-700">{locName}</h3>
                          <span className="text-xs text-gray-400">{mastered}/{words.length} 已掌握</span>
                        </div>
                        <div className="space-y-3">
                          {words.map((w) => (
                            <div key={w.word}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-800">{w.word}</span>
                                  {w.mastered && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✓</span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {Math.round((w.best_confidence || 0) * 100)}% · {w.attempt_count} 次
                                </span>
                              </div>
                              <ScoreBar value={(w.best_confidence || 0) * 100} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 最近練習記錄 */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">最近練習記錄</h2>
              <div className="space-y-2">
                {sessions.slice(0, 10).map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-gray-800">
                        {s.name_zh || s.location_id}
                        {s.name_en && <span className="text-gray-400 font-normal ml-1.5 text-xs">{s.name_en}</span>}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{s.target_phrase}</p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        {new Date(s.created_at).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold shrink-0 ${Number(s.score) >= 85 ? 'text-green-500' : Number(s.score) >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {s.score}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
