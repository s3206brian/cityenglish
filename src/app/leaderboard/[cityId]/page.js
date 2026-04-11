'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

const CITIES = [
  { id: 'taitung', name: '台東', emoji: '🏔️', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'tainan',  name: '台南', emoji: '🏯', gradient: 'from-amber-500 to-orange-600' },
  { id: 'hualien', name: '花蓮', emoji: '🏞️', gradient: 'from-blue-500 to-cyan-600' },
];

function medalColor(rank) {
  if (rank === 1) return 'text-yellow-500';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-amber-600';
  return 'text-gray-300';
}

function medalEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

function ScoreBar({ value }) {
  const color = value >= 85 ? 'bg-green-500' : value >= 60 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function LeaderboardPage() {
  const { cityId } = useParams();
  const { user } = useAuth();
  const city = CITIES.find((c) => c.id === cityId) || CITIES[0];

  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState(cityId || 'taitung');

  useEffect(() => {
    setLoading(true);
    setRows(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/leaderboard/${activeCity}`)
      .then((r) => r.json())
      .then((d) => { setRows(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setRows([]); setLoading(false); });
  }, [activeCity]);

  const activeCity_ = CITIES.find((c) => c.id === activeCity) || CITIES[0];

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
            <h1 className="text-xl font-bold text-gray-900">城市排行榜</h1>
            <p className="text-xs text-gray-400">各城市最高分前 20 名</p>
          </div>
        </div>

        {/* City tabs */}
        <div className="flex gap-2 mb-6">
          {CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCity(c.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeCity === c.id
                  ? `bg-gradient-to-r ${c.gradient} text-white shadow-sm`
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Leaderboard */}
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
                  <div className="h-6 bg-gray-100 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rows?.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-medium text-gray-700 mb-1">還沒有人上榜</p>
            <p className="text-sm mb-6">成為第一個練習 {activeCity_.name} 的人！</p>
            <Link
              href={`/cities/${activeCity}`}
              className={`bg-gradient-to-r ${activeCity_.gradient} text-white px-6 py-2.5 rounded-xl font-medium`}
            >
              開始練習
            </Link>
          </div>
        )}

        {!loading && rows?.length > 0 && (
          <div className="space-y-2.5">
            {/* Top 3 podium */}
            {rows.length >= 3 && (
              <div className="flex items-end justify-center gap-3 mb-6 pt-2">
                {/* 2nd */}
                <div className="flex flex-col items-center flex-1">
                  <Avatar row={rows[1]} size={48} />
                  <p className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[80px] text-center">
                    {displayName(rows[1])}
                  </p>
                  <div className={`bg-gradient-to-br ${activeCity_.gradient} text-white text-sm font-bold rounded-t-xl w-full text-center py-3 mt-2`}>
                    🥈 {rows[1].best_score}
                  </div>
                </div>
                {/* 1st */}
                <div className="flex flex-col items-center flex-1 -mb-0">
                  <div className="text-2xl mb-1">👑</div>
                  <Avatar row={rows[0]} size={56} />
                  <p className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[80px] text-center">
                    {displayName(rows[0])}
                  </p>
                  <div className={`bg-gradient-to-br ${activeCity_.gradient} text-white text-sm font-bold rounded-t-xl w-full text-center py-4 mt-2`}>
                    🥇 {rows[0].best_score}
                  </div>
                </div>
                {/* 3rd */}
                <div className="flex flex-col items-center flex-1">
                  <Avatar row={rows[2]} size={48} />
                  <p className="text-xs font-medium text-gray-700 mt-1.5 truncate max-w-[80px] text-center">
                    {displayName(rows[2])}
                  </p>
                  <div className={`bg-gradient-to-br ${activeCity_.gradient} text-white text-sm font-bold rounded-t-xl w-full text-center py-2.5 mt-2`}>
                    🥉 {rows[2].best_score}
                  </div>
                </div>
              </div>
            )}

            {/* Full list */}
            <div className="space-y-2">
              {rows.map((row, idx) => {
                const rank = idx + 1;
                const isMe = user?.id === row.user_id;
                return (
                  <div
                    key={row.user_id}
                    className={`bg-white rounded-2xl border px-4 py-3 flex items-center gap-3 ${
                      isMe ? 'border-blue-300 bg-blue-50' : 'border-gray-100'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-7 text-center">
                      {medalEmoji(rank) ? (
                        <span className="text-lg">{medalEmoji(rank)}</span>
                      ) : (
                        <span className={`text-sm font-bold ${medalColor(rank)}`}>{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar row={row} size={36} />

                    {/* Name + stats */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                          {displayName(row)}
                        </p>
                        {isMe && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full shrink-0">我</span>}
                      </div>
                      <p className="text-xs text-gray-400">{row.attempt_count} 次練習</p>
                      <ScoreBar value={Number(row.best_score)} />
                    </div>

                    {/* Best score */}
                    <div className={`text-xl font-bold shrink-0 ${
                      Number(row.best_score) >= 85 ? 'text-green-500' :
                      Number(row.best_score) >= 60 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {row.best_score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function displayName(row) {
  if (!row.display_name) return '匿名用戶';
  // if it's an email, show only the part before @
  if (row.display_name.includes('@')) return row.display_name.split('@')[0];
  return row.display_name;
}

function Avatar({ row, size }) {
  const s = size || 36;
  const initial = displayName(row)?.[0]?.toUpperCase() || '?';
  return row.avatar_url ? (
    <img
      src={row.avatar_url}
      alt={displayName(row)}
      referrerPolicy="no-referrer"
      className="rounded-full object-cover border border-gray-200 shrink-0"
      style={{ width: s, height: s }}
    />
  ) : (
    <div
      className="rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0"
      style={{ width: s, height: s, fontSize: s * 0.4 }}
    >
      {initial}
    </div>
  );
}
