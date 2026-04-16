'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-green-600',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-violet-500',
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('id, title, emoji, gradient, duration, published, sort_order, youtube_id, updated_at')
      .order('sort_order', { ascending: true });
    setCourses(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(course) {
    await supabase.from('courses').update({ published: !course.published }).eq('id', course.id);
    load();
  }

  async function deleteCourse(course) {
    if (!confirm(`確定刪除「${course.title}」？此操作無法復原。`)) return;
    await supabase.from('courses').delete().eq('id', course.id);
    load();
  }

  async function moveOrder(course, dir) {
    const idx = courses.findIndex(c => c.id === course.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= courses.length) return;
    const swap = courses[swapIdx];
    await supabase.from('courses').update({ sort_order: swap.sort_order }).eq('id', course.id);
    await supabase.from('courses').update({ sort_order: course.sort_order }).eq('id', swap.id);
    load();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">課程管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">共 {courses.length} 堂課程</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新增課程
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p>還沒有課程，點擊右上角新增</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex">
              {/* Color strip */}
              <div className={`w-2 bg-gradient-to-b ${course.gradient} shrink-0`} />

              <div className="flex-1 px-5 py-4 flex items-center gap-4">
                <span className="text-2xl">{course.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 truncate">{course.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      course.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {course.published ? '已發布' : '草稿'}
                    </span>
                    {!course.youtube_id && (
                      <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">無影片</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{course.duration} · {course.id}</p>
                </div>

                {/* Order buttons */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveOrder(course, -1)} disabled={idx === 0}
                    className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button onClick={() => moveOrder(course, 1)} disabled={idx === courses.length - 1}
                    className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(course)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                      course.published
                        ? 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500'
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {course.published ? '取消發布' : '發布'}
                  </button>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition font-medium"
                  >
                    編輯
                  </Link>
                  <button
                    onClick={() => deleteCourse(course)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
