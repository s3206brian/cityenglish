'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

const TABS = [
  { id: 'global', name: '全球', emoji: '🌍', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'taitung', name: '台東', emoji: '🏔️', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'tainan',  name: '台南', emoji: '🏯', gradient: 'from-amber-500 to-orange-600' },
  { id: 'hualien', name: '花蓮', emoji: '🏞️', gradient: 'from-blue-500 to-cyan-600' },
];

function PointsBar({ value, max }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
      <div className="h-full rounded-full bg-purple-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

function medalEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

export default function LeaderboardPage() {
  const { cityId } = useParams();
  const { user } = useAuth();

  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(cityId || 'global');

  useEffect(() => {
    setLoading(true);
    setRows(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/leaderboard/${activeTab}`)
      .then((r) => r.json())
      .then((d) => { setRows(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setRows([]); setLoading(false); });
  }, [activeTab]);

  const activeTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];
  const maxPoints = rows?.[0] ? Number(rows[0].total_points) : 1;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">排行榜</h1>
            <p className="text-xs text-gray-400">練習越多、分數越高，積分累積越快</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
                activeTab === t.id
                  ? `bg-gradient-to-r ${t.gradient} text-white shadow-sm`
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded w-32 mb-2" />
                    <div className="h-2 bg-gray-100 rounded w-20" />
                  </div>
                  <div className="h-6 bg-gray-100 rounded w-14" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rows?.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-medium text-gray-700 mb-1">還沒有人上榜</p>
            <p className="text-sm mb-6">成為第一個！</p>
            <Link href="/" className={`bg-gradient-to-r ${activeTabInfo.gradient} text-white px-6 py-2.5 rounded-xl font-medium`}>
              開始練習
            </Link>
          </div>
        )}

        {!loading && rows?.length > 0 && (
          <>
            {/* Top 3 podium */}
            {rows.length >= 3 && (
              <div className="flex items-end justify-center gap-3 mb-6 pt-2">
                {[1, 0, 2].map((idx) => {
                  const row = rows[idx];
                  const rank = idx + 1;
                  const heights = ['py-3', 'py-4', 'py-2.5'];
                  const medals = ['🥈', '🥇', '🥉'];
                  const isTop = idx === 0;
                  return (
                    <div key={row.user_id} className="flex flex-col items-center flex-1">
                      {isTop && <div className="text-2xl mb-1">👑</div>}
                      <Avatar row={row} size={isTop ? 56 : 48} />
                      <p className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[80px] text-center">
                        {fmtName(row)}
                      </p>
                      <p className="text-xs text-purple-500 font-bold mt-0.5">💎 {row.total_points}</p>
                      <div className={`bg-gradient-to-br ${activeTabInfo.gradient} text-white text-sm font-bold rounded-t-xl w-full text-center ${heights[idx]} mt-2`}>
                        {medals[idx]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="space-y-2">
              {rows.map((row, idx) => {
                const rank = idx + 1;
                const isMe = user?.id === row.user_id;
                return (
                  <div key={row.user_id}
                    className={`bg-white rounded-2xl border px-4 py-3 flex items-center gap-3 ${isMe ? 'border-blue-300 bg-blue-50' : 'border-gray-100'}`}
                  >
                    <div className="w-7 text-center shrink-0">
                      {medalEmoji(rank)
                        ? <span className="text-lg">{medalEmoji(rank)}</span>
                        : <span className="text-sm font-bold text-gray-300">{rank}</span>}
                    </div>
                    <Avatar row={row} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                          {fmtName(row)}
                        </p>
                        {isMe && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full shrink-0">我</span>}
                      </div>
                      <p className="text-xs text-gray-400">{row.attempt_count} 次練習 · 最高 {row.best_score} 分</p>
                      <PointsBar value={Number(row.total_points)} max={maxPoints} />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-purple-600">💎 {row.total_points}</div>
                      <div className="text-xs text-gray-400">積分</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function fmtName(row) {
  if (!row.display_name) return '匿名用戶';
  if (row.display_name.includes('@')) return row.display_name.split('@')[0];
  return row.display_name;
}

function Avatar({ row, size = 36 }) {
  const initial = fmtName(row)?.[0]?.toUpperCase() || '?';
  return row.avatar_url ? (
    <img src={row.avatar_url} alt={fmtName(row)} referrerPolicy="no-referrer"
      className="rounded-full object-cover border border-gray-200 shrink-0"
      style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initial}
    </div>
  );
}
