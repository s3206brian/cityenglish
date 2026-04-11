'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/components/AuthProvider';
import { CITIES } from '../data/cities';

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

  const avgScore = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.score, 0) / sessions.length)
    : 0;
  const masteredCount = wordProgress.filter((w) => w.mastered).length;

  // Group word progress by location
  const byLocation = {};
  for (const w of wordProgress) {
    const locId = w.location_id || 'other';
    if (!byLocation[locId]) byLocation[locId] = [];
    byLocation[locId].push(w);
  }

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">我的進度</h1>
        <p className="text-gray-400 text-sm mb-8">追蹤你的英文口說練習歷程</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">{sessions.length}</div>
            <p className="text-xs text-gray-400 mt-1">練習次數</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <div className={`text-3xl font-bold ${avgScore >= 85 ? 'text-green-500' : avgScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
              {avgScore}
            </div>
            <p className="text-xs text-gray-400 mt-1">平均分數</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-emerald-500">{masteredCount}</div>
            <p className="text-xs text-gray-400 mt-1">已掌握單字</p>
          </div>
        </div>

        {status === 'unauthenticated' && (
          <div className="text-center py-20 text-gray-400">
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

        {loading && status !== 'unauthenticated' && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">📊</div>
            <p>載入中…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="mb-2">無法連線到伺服器</p>
            <p className="text-xs">請確認後端服務是否正常運作</p>
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🎙️</div>
            <p className="text-lg font-medium mb-2">還沒有練習記錄</p>
            <p className="text-sm mb-6">選擇一個城市，開始你的第一次口說練習！</p>
            <Link
              href="/cities/taitung"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              探索城市
            </Link>
          </div>
        )}

        {/* Word progress by location */}
        {!loading && !error && wordProgress.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">單字掌握度</h2>
            <div className="space-y-6">
              {Object.entries(byLocation).map(([locId, words]) => {
                const allCities = Object.values(CITIES);
                let locName = locId;
                for (const c of allCities) {
                  const l = c.locations.find((x) => x.id === locId);
                  if (l) { locName = `${l.nameZh} — ${l.nameEn}`; break; }
                }
                return (
                  <div key={locId} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">{locName}</h3>
                    <div className="space-y-4">
                      {words.map((w) => (
                        <div key={w.word}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{w.word}</span>
                              {w.mastered && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">已掌握</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-400">
                                {Math.round((w.best_confidence || 0) * 100)}% · {w.attempt_count} 次
                              </span>
                            </div>
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

        {/* Recent sessions */}
        {!loading && !error && sessions.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">最近練習記錄</h2>
            <div className="space-y-3">
              {sessions.slice(0, 10).map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.name_en || s.location_id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.target_phrase}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(s.created_at).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${s.score >= 85 ? 'text-green-500' : s.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {s.score}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
