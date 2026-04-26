'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/components/AuthProvider';

export default function CertifyPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notes, setNotes] = useState('');
  const [points, setPoints] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    supabase.from('courses').select('id, title').eq('published', true).order('sort_order').then(({ data }) => setCourses(data || []));
    loadHistory();
  }, []);

  async function loadHistory() {
    setHistoryLoading(true);
    const { data } = await supabase
      .from('certifications')
      .select('id, points, notes, created_at, course_id, courses(title), student:student_id(display_name, email)')
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory(data || []);
    setHistoryLoading(false);
  }

  async function handleSearch() {
    if (!search.trim()) return;
    setSearching(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, email, avatar_url')
      .or(`display_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
      .limit(10);
    setSearchResults(data || []);
    setSearching(false);
  }

  async function handleCertify() {
    if (!selectedStudent) { setError('請選擇學員'); return; }
    setError('');
    setSubmitting(true);
    const { error: err } = await supabase.from('certifications').insert({
      student_id: selectedStudent.id,
      certified_by: user?.id,
      course_id: selectedCourse || null,
      notes: notes.trim(),
      points: Number(points) || 50,
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setSuccess({ student: selectedStudent.display_name || selectedStudent.email, points });
    setSelectedStudent(null);
    setSelectedCourse('');
    setNotes('');
    setPoints(50);
    setSearch('');
    setSearchResults([]);
    loadHistory();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/courses" className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">學員認證</h1>
          <p className="text-sm text-gray-400">為完成課程的學員增加積分</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-green-800">認證成功！</p>
            <p className="text-xs text-green-600">已為 {success.student} 增加 {success.points} 積分</p>
          </div>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-400 hover:text-green-600 text-xs">關閉</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: certification form */}
        <div className="space-y-5">
          {/* Student search */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">搜尋學員</h2>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="輸入名稱或 Email..."
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {searching ? '搜尋中' : '搜尋'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
                {searchResults.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { setSelectedStudent(u); setSearchResults([]); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition ${selectedStudent?.id === u.id ? 'bg-blue-50' : ''}`}
                  >
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {(u.display_name || u.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.display_name || '（未命名）'}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedStudent && (
              <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-blue-600 text-sm font-medium">已選擇：</span>
                <span className="text-sm text-gray-800">{selectedStudent.display_name || selectedStudent.email}</span>
                <button onClick={() => setSelectedStudent(null)} className="ml-auto text-gray-400 hover:text-red-400 text-xs">✕</button>
              </div>
            )}
          </div>

          {/* Certification details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">認證資訊</h2>

            <div>
              <label className="block text-xs text-gray-500 mb-1">對應課程（選填）</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="">不指定課程</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">積分（預設 50）</label>
              <input
                type="number"
                value={points}
                onChange={e => setPoints(e.target.value)}
                min={1}
                max={500}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">備註（選填）</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                placeholder="例如：完成初階課程第一節..."
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              onClick={handleCertify}
              disabled={submitting || !selectedStudent}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? '認證中...' : `確認認證 +${points} 積分`}
            </button>
          </div>
        </div>

        {/* Right: history */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">最近認證記錄</h2>
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">還沒有認證記錄</p>
          ) : (
            <div className="space-y-3">
              {history.map(h => (
                <div key={h.id} className="border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {h.student?.display_name || h.student?.email || '（未知）'}
                    </span>
                    <span className="text-sm font-bold text-purple-600">+{h.points}</span>
                  </div>
                  {h.courses?.title && (
                    <p className="text-xs text-gray-500">{h.courses.title}</p>
                  )}
                  {h.notes && <p className="text-xs text-gray-400 mt-0.5">{h.notes}</p>}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(h.created_at).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
